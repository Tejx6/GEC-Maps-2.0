import React, { useRef, useState, useEffect } from 'react';
import type { Location, Event } from '../../types';

interface FuturisticMapContainerProps {
    locations: Location[];
    events: Event[];
    selectedLocation: Location | null;
    hoveredLocation: Location | null;
    onSelectLocation: (location: Location | null) => void;
    onHoverLocation: (location: Location | null) => void;
    onStreetViewClick: (location: Location) => void;
    isAddingLocation: boolean;
    onMapClickForAddLocation: (coords: { x: number; y: number }) => void;
    isAddingEvent: boolean;
    onMapClickForAddEvent: (coords: { x: number; y: number }) => void;
}

const LocationPinIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

const EventIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
    </svg>
);

const FuturisticMapContainer: React.FC<FuturisticMapContainerProps> = ({
    locations, events, selectedLocation, hoveredLocation,
    onSelectLocation, onHoverLocation, onStreetViewClick,
    isAddingLocation, onMapClickForAddLocation,
    isAddingEvent, onMapClickForAddEvent
}) => {
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const mapRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const didDrag = useRef(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });

    const isAddMode = isAddingLocation || isAddingEvent;

    useEffect(() => {
        if (selectedLocation && containerRef.current) {
            const mapWidth = containerRef.current.offsetWidth;
            const mapHeight = containerRef.current.offsetHeight;
            const targetScale = 1.75;

            const newX = (mapWidth / 2) - ((selectedLocation.position.x / 100) * mapWidth * targetScale);
            const newY = (mapHeight / 2) - ((selectedLocation.position.y / 100) * mapHeight * targetScale);

            setTransform({ scale: targetScale, x: newX, y: newY });
        } else if (!selectedLocation && !isAddMode) {
            setTransform({ scale: 1, x: 0, y: 0 });
        }
    }, [selectedLocation, isAddMode]);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(0.5, transform.scale + scaleAmount), 3);
        setTransform(prev => ({ ...prev, scale: newScale }));
    };
    
    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true; didDrag.current = false; lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        didDrag.current = true;
        const dx = e.clientX - lastMousePosition.current.x;
        const dy = e.clientY - lastMousePosition.current.y;
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (didDrag.current) return;
        e.stopPropagation();
        if (!mapRef.current) return;
        
        const rect = mapRef.current.getBoundingClientRect();
        const percentX = ((e.clientX - rect.left) / rect.width) * 100;
        const percentY = ((e.clientY - rect.top) / rect.height) * 100;

        if (isAddingLocation) {
            onMapClickForAddLocation({ x: percentX, y: percentY });
            return;
        }
        if (isAddingEvent) {
            onMapClickForAddEvent({ x: percentX, y: percentY });
            return;
        }
        onSelectLocation(null);
    };

    return (
        <div 
            ref={containerRef}
            className={`w-full h-full relative overflow-hidden ${isAddMode ? 'cursor-crosshair' : ''}`}
            style={{
                backgroundColor: '#0d1117',
                backgroundImage: `
                    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
            }}
            onWheel={handleWheel}
        >
            <div
                ref={mapRef}
                className={`relative w-full h-full transition-transform duration-500 ease-in-out ${!isAddMode && transform.scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
                style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
                onMouseDown={transform.scale > 1 ? handleMouseDown : undefined}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onClick={handleMapClick}
            >
                <div 
                    className="absolute inset-0 w-full h-full"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/u/0/d/10illXwtaDATqRea_91j0Lp1TNP5Lr-tp=w1920-h937')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 0.3 }}
                ></div>

                {locations.map(location => {
                    const isHovered = hoveredLocation?.id === location.id;
                    const color = location.color || '#38bdf8';
                    return (
                        <div key={location.id} className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            style={{ left: `${location.position.x}%`, top: `${location.position.y}%` }}
                            onMouseEnter={() => !isAddMode && onHoverLocation(location)} onMouseLeave={() => onHoverLocation(null)}
                            onClick={(e) => { if (isAddMode) return; e.stopPropagation(); onSelectLocation(location); }}
                        >
                            <div className={`w-8 h-8 rounded-full transition-all duration-300 transform flex items-center justify-center text-white ${isHovered ? 'scale-150' : 'scale-100'}`}
                                style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}, 0 0 30px ${color}80, 0 0 45px ${color}40` }}
                            >
                                {location.icon}
                            </div>
                            {isHovered && !isAddMode && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-56 sm:w-64 p-4 bg-black/40 backdrop-blur-lg rounded-lg border border-white/10 shadow-xl pointer-events-none animate-fade-in-up">
                                    <h3 className="font-bold text-lg" style={{ color }}>{location.name}</h3>
                                    <p className="text-sm text-gray-300 mt-1 mb-3">{location.description}</p>
                                    {location.streetViewImage && (
                                        <div onClick={(e) => { e.stopPropagation(); onStreetViewClick(location); }} className="w-full flex items-center justify-center text-sm px-3 py-2 bg-purple-600/50 rounded-full hover:bg-purple-600/80 transition-colors pointer-events-auto">
                                            <LocationPinIcon className="w-4 h-4 mr-2" /> Click for Street View
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Event Markers */}
                {events.map(event => (
                    <div key={event.id} className="absolute -translate-x-1/2 -translate-y-1/2 group" style={{ left: `${event.position.x}%`, top: `${event.position.y}%` }}>
                        <div className="relative flex items-center justify-center w-10 h-10" aria-label={`Event: ${event.name}`}>
                            <span className="absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75 animate-ping"></span>
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50 text-white"
                                 style={{boxShadow: `0 0 15px #ec4899, 0 0 30px #ec489980`}}>
                                <EventIcon className="w-5 h-5" />
                            </div>
                            <div className="absolute top-full mt-2 whitespace-nowrap px-3 py-1.5 text-sm text-white bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md shadow-lg border border-white/10">
                                <p className="font-bold text-pink-300">{event.name}</p>
                                <p className="text-xs">{event.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             {isAddMode && (
                <p className="absolute bottom-24 sm:bottom-auto sm:top-32 lg:top-24 left-1/2 -translate-x-1/2 text-base sm:text-lg font-medium text-cyan-200 bg-black/30 px-4 py-2 rounded-full animate-pulse">
                    Click on the map to add a new point
                </p>
            )}
        </div>
    );
};

export default FuturisticMapContainer;