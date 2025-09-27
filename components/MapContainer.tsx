import React, { useState, useRef, useEffect } from 'react';
import type { Location, Event } from '../types';

interface MapContainerProps {
    locations: Location[];
    events: Event[];
    selectedLocation: Location | null;
    onSelectLocation: (location: Location) => void;
    highlightedLocations: Location[];
    onBackgroundClick: () => void;
    isAddingLocation: boolean;
    onMapClickForAddLocation: (coords: { x: number; y: number }) => void;
    isAddingEvent: boolean;
    onMapClickForAddEvent: (coords: { x: number; y: number }) => void;
}

const EventIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

const MapContainer: React.FC<MapContainerProps> = ({ locations, events, selectedLocation, onSelectLocation, highlightedLocations, onBackgroundClick, isAddingLocation, onMapClickForAddLocation, isAddingEvent, onMapClickForAddEvent }) => {
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
            const targetScale = 1.75; // Zoom in to focus

            const newX = (mapWidth / 2) - ((selectedLocation.position.x / 100) * mapWidth * targetScale);
            const newY = (mapHeight / 2) - ((selectedLocation.position.y / 100) * mapHeight * targetScale);

            setTransform({
                scale: targetScale,
                x: newX,
                y: newY,
            });
        } else if (!selectedLocation && !isAddMode) {
            // No selection, reset view
            setTransform({ scale: 1, x: 0, y: 0 });
        }
    }, [selectedLocation, isAddMode]);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(0.5, transform.scale + scaleAmount), 3);

        setTransform(prev => ({
            ...prev,
            scale: newScale,
        }));
    };
    
    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        didDrag.current = false;
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        didDrag.current = true;
        const dx = e.clientX - lastMousePosition.current.x;
        const dy = e.clientY - lastMousePosition.current.y;
        
        setTransform(prev => ({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy,
        }));
        
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (didDrag.current) return;
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        if (isAddingLocation) {
            onMapClickForAddLocation({ x: percentX, y: percentY });
            return;
        }
        if (isAddingEvent) {
            onMapClickForAddEvent({ x: percentX, y: percentY });
            return;
        }
        
        onBackgroundClick();
    };
    
    const highlightedIds = new Set(highlightedLocations.map(loc => loc.id));

    return (
        <div 
            ref={containerRef}
            className={`w-full h-full bg-gray-200 dark:bg-gray-800 overflow-hidden ${isAddMode ? 'cursor-crosshair' : ''}`}
            onWheel={handleWheel}
        >
            <div
                ref={mapRef}
                className={`relative w-full h-full transition-transform duration-500 ease-in-out ${transform.scale === 1 ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
                style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    backgroundImage: `url('https://lh3.googleusercontent.com/u/0/d/10illXwtaDATqRea_91j0Lp1TNP5Lr-tp=w1920-h937')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
                onMouseDown={transform.scale > 1 ? handleMouseDown : undefined}
                onMouseUp={transform.scale > 1 ? handleMouseUp : undefined}
                onMouseLeave={transform.scale > 1 ? handleMouseUp : undefined}
                onMouseMove={transform.scale > 1 ? handleMouseMove : undefined}
                onClick={handleMapClick}
            >
                {/* Location Markers */}
                {locations.map(location => {
                    const isSelected = selectedLocation?.id === location.id;
                    const isHighlighted = highlightedIds.has(location.id) && !isSelected;

                    return (
                        <div
                            key={location.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group"
                            style={{ left: `${location.position.x}%`, top: `${location.position.y}%` }}
                        >
                            <button
                                onClick={(e) => {
                                    if (isAddMode) return;
                                    e.stopPropagation();
                                    onSelectLocation(location);
                                }}
                                className={`relative flex items-center justify-center w-10 h-10 focus:outline-none ${isAddMode ? 'cursor-not-allowed' : ''}`}
                                aria-label={`Select ${location.name}`}
                            >
                                <span className={`absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 ${isSelected ? 'animate-ping' : 'opacity-0'}`}></span>
                                {isHighlighted && <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75 animate-ping"></span>}
                                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 transform group-hover:scale-110 shadow-lg ${isSelected ? 'bg-fuchsia-500 scale-125 shadow-fuchsia-500/50' : isHighlighted ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-cyan-500 shadow-cyan-500/50'} text-white`}>
                                    {location.icon}
                                </div>
                                <span className="absolute top-full mt-2 whitespace-nowrap px-3 py-1.5 text-sm text-white bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md shadow-lg border border-white/10">
                                    {location.name}
                                </span>
                            </button>
                        </div>
                    );
                })}
                
                {/* Event Markers */}
                {events.map(event => (
                    <div
                        key={event.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group"
                        style={{ left: `${event.position.x}%`, top: `${event.position.y}%` }}
                    >
                        <div className="relative flex items-center justify-center w-10 h-10" aria-label={`Event: ${event.name}`}>
                            <span className="absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75 animate-ping"></span>
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50 text-white">
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
        </div>
    );
};

export default MapContainer;