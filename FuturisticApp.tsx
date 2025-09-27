



import React, { useState, useCallback, useMemo, useEffect } from 'react';
import FuturisticHeader from './components/futuristic/FuturisticHeader';
import FuturisticMapContainer from './components/futuristic/FuturisticMapContainer';
import FloatingActionButtons from './components/futuristic/FloatingActionButtons';
import TopRightStatus from './components/futuristic/TopRightStatus';
import CampusDepartmentsPanel from './components/futuristic/CampusDepartmentsPanel';
import DepartmentNavigatorPanel from './components/futuristic/DepartmentNavigatorPanel';
import PannellumViewer from './components/PannellumViewer';
import AddLocationModal from './components/AddLocationModal';
import AddEventModal from './components/AddEventModal';
import ProfileMenu from './components/ProfileMenu';
import View360Screen from './components/futuristic/View360Screen';
import type { Location, Event, User, FuturisticTab } from './types';
import { ICONS, FUTURISTIC_COLOR_PALETTE } from './constants';


// --- New Upload Screen Component --- //
interface Upload360ScreenProps {
    locations: Location[];
    onUpdateLocationImage: (locationId: string, imageUrl: string) => void;
}

const Upload360Screen: React.FC<Upload360ScreenProps> = ({ locations, onUpdateLocationImage }) => {
    const [selectedLocationId, setSelectedLocationId] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);

    const selectedLocation = useMemo(() => {
        return locations.find(loc => loc.id === selectedLocationId);
    }, [locations, selectedLocationId]);
    
    const totalUploadedImages = useMemo(() => {
        return locations.filter(loc => loc.streetViewImage).length;
    }, [locations]);

    const processFile = (file: File) => {
        if (!selectedLocationId) {
            alert('Please select a department first.');
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            onUpdateLocationImage(selectedLocationId, reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };

    return (
        <div className="absolute inset-0 pt-32 lg:pt-24 z-10 p-2 sm:p-6 flex flex-col animate-fade-in-up">
            <div className="flex-shrink-0 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.881 4.002l-.423-.423a2 2 0 00-2.828 0l-1.62 1.62a2 2 0 000 2.828l.423.423" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9.004 9.004 0 008.322-5.402l-3.1-3.1a.5.5 0 00-.707 0L12 16.939l-4.515-4.515a.5.5 0 00-.707 0l-3.1 3.1A9.004 9.004 0 0012 21z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-white">360° Image Upload</h2>
                            <p className="text-xs sm:text-sm text-gray-400">Add panoramic images for department street views</p>
                        </div>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-60"></span>
                        <span className="relative px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium bg-cyan-600 rounded-full border border-cyan-400">{totalUploadedImages} Images</span>
                    </div>
                </div>
            </div>
            
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 overflow-y-auto">
                {/* Left Panel */}
                <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6 flex flex-col">
                    <label htmlFor="department-select" className="font-semibold text-gray-300 mb-2">Select Department</label>
                    <select id="department-select" value={selectedLocationId} onChange={(e) => setSelectedLocationId(e.target.value)} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-2.5 mb-6 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option value="" disabled>Choose a department...</option>
                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                    </select>

                    <div 
                        className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-cyan-400 bg-cyan-900/40' : 'border-gray-600'}`}
                        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                    >
                        <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15v6m-3-3h6" /></svg></div>
                            <p className="font-semibold text-white">Drop 360° images here</p>
                            <p className="text-gray-400 text-sm">or click to browse files</p>
                        </label>
                        <div className="flex gap-2 mt-4">
                            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-full">Panoramic</span>
                            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-full">JPG, PNG</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 bg-gray-800/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>360° Photography Tips</h4>
                        <ul className="list-disc list-inside text-gray-400 text-sm mt-2 space-y-1 pl-2">
                            <li>Use a 360° camera or panoramic mode.</li>
                            <li>Ensure good lighting for best results.</li>
                        </ul>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-white">Uploaded Images</h3>
                        <span className="text-sm text-gray-400">{selectedLocation?.streetViewImage ? '1 / 1' : '0 / 0'}</span>
                    </div>
                    <div className="flex-grow bg-gray-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                        {selectedLocation?.streetViewImage ? (
                            <img src={selectedLocation.streetViewImage} alt={`${selectedLocation.name} street view`} className="w-full h-full object-cover"/>
                        ) : (
                            <div className="text-center text-gray-500">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                <p>No images uploaded yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- New Settings Modal Component --- //
interface SettingsModalProps {
    isVisible: boolean;
    onClose: () => void;
    locations: Location[];
    events: Event[];
    onRemoveLocation: (locationId: string) => void;
    onRemoveEvent: (eventId: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, onClose, locations, events, onRemoveLocation, onRemoveEvent }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-lg p-6 mx-4 bg-black/50 backdrop-blur-2xl rounded-2xl shadow-2xl border border-cyan-500/30 text-gray-200 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-center text-white drop-shadow-[0_0_5px_rgba(0,200,255,0.5)]">Settings</h3>
                
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">
                    {/* Manage Locations */}
                    <div>
                        <h4 className="font-semibold text-lg mb-2 text-cyan-300">Manage Locations</h4>
                        <div className="space-y-2">
                            {locations.length > 0 ? (
                                locations.map(location => (
                                    <div key={location.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                        <span className="font-medium">{location.name}</span>
                                        <button 
                                            onClick={() => onRemoveLocation(location.id)}
                                            className="px-3 py-1 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-full hover:bg-red-500/30 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))
                            ) : <p className="text-center text-gray-400 py-4">No locations added.</p>}
                        </div>
                    </div>
                    {/* Manage Events */}
                    <div>
                        <h4 className="font-semibold text-lg mb-2 text-pink-300">Manage Events</h4>
                         <div className="space-y-2">
                            {events.length > 0 ? (
                                events.map(event => (
                                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                        <span className="font-medium">{event.name}</span>
                                        <button 
                                            onClick={() => onRemoveEvent(event.id)}
                                            className="px-3 py-1 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-full hover:bg-red-500/30 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))
                            ) : <p className="text-center text-gray-400 py-4">No events added.</p>}
                        </div>
                    </div>
                </div>

                <button onClick={onClose} className="w-full mt-4 px-4 py-3 font-semibold text-white uppercase bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow">
                    Done
                </button>
            </div>
        </div>
    );
};


interface FuturisticAppProps {
    onToggleViewMode: () => void;
    locations: Location[];
    events: Event[];
    user: User;
    onUpdateLocation: (location: Location) => void;
    onAddLocation: (data: Partial<Location>, coords: { x: number; y: number }) => void;
    onDeleteLocation: (locationId: string) => void;
    onAddEvent: (data: { name: string; description: string; }, coords: { x: number; y: number }) => void;
    onDeleteEvent: (eventId: string) => void;
    onOpenAuthModal: () => void;
    onSignOut: () => void;
    onOpenAdminSettingsModal: () => void;
}

const FuturisticApp: React.FC<FuturisticAppProps> = ({ 
    onToggleViewMode, locations, events, user,
    onUpdateLocation, onAddLocation, onDeleteLocation, onAddEvent, onDeleteEvent,
    onOpenAuthModal, onSignOut, onOpenAdminSettingsModal
}) => {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
    const [streetViewLocation, setStreetViewLocation] = useState<Location | null>(null);
    const [isNavigatorVisible, setNavigatorVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<FuturisticTab>('Campus Map');
    
    // State for adding locations
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [isAddLocationModalOpen, setAddLocationModalOpen] = useState(false);
    const [newLocationCoords, setNewLocationCoords] = useState<{ x: number; y: number } | null>(null);
    
    // State for adding events
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
    const [newEventCoords, setNewEventCoords] = useState<{ x: number; y: number } | null>(null);

    // State for settings modal
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    
    useEffect(() => {
        // If user is a guest and the active tab is an admin-only tab, reset it.
        if (user?.type !== 'admin' && activeTab === 'Upload 360°') {
            setActiveTab('Campus Map');
        }
        // If user is an admin and on a guest-only tab, reset it.
        if (user?.type === 'admin' && activeTab === '360 View') {
             setActiveTab('Campus Map');
        }
    }, [user, activeTab]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const locationId = params.get('location');
        if (locationId && locations.length > 0) {
            const foundLocation = locations.find(loc => loc.id === locationId);
            if (foundLocation) {
                setSelectedLocation(foundLocation);
            }
        }
    }, [locations]);

    const handleSelectLocation = useCallback((location: Location | null) => {
        if (isAddingLocation || isAddingEvent) return;
        setSelectedLocation(location);
    }, [isAddingLocation, isAddingEvent]);

    const handleUpdateLocationImage = (locationId: string, imageUrl: string) => {
        const location = locations.find(l => l.id === locationId);
        if (location) {
            onUpdateLocation({ ...location, streetViewImage: imageUrl });
        }
    };

    // --- Location Add/Remove Handlers ---
    const handleToggleAddLocationMode = () => {
        setIsAddingLocation(prev => !prev);
        setIsAddingEvent(false);
        setSelectedLocation(null); 
    };
    const handleMapClickForAddLocation = (coords: { x: number; y: number }) => {
        setNewLocationCoords(coords);
        setAddLocationModalOpen(true);
    };
    const handleSaveNewLocation = (data: Partial<Location>) => {
        if (!newLocationCoords) return;
        onAddLocation(data, newLocationCoords);
        setAddLocationModalOpen(false); setIsAddingLocation(false); setNewLocationCoords(null);
    };
    const handleRemoveLocation = (locationId: string) => {
        onDeleteLocation(locationId);
        if (selectedLocation?.id === locationId) setSelectedLocation(null);
        if (hoveredLocation?.id === locationId) setHoveredLocation(null);
    };

    // --- Event Add/Remove Handlers ---
    const handleToggleAddEventMode = () => {
        setIsAddingEvent(prev => !prev);
        setIsAddingLocation(false);
        setSelectedLocation(null);
    };
    const handleMapClickForAddEvent = (coords: { x: number; y: number }) => {
        setNewEventCoords(coords);
        setAddEventModalOpen(true);
    };
    const handleSaveNewEvent = (data: { name: string; description: string }) => {
        if (newEventCoords) {
            onAddEvent(data, newEventCoords);
        }
        setAddEventModalOpen(false); setIsAddingEvent(false); setNewEventCoords(null);
    };
    const handleRemoveEvent = (eventId: string) => {
        onDeleteEvent(eventId);
    };
    
    // --- Other Handlers ---
    const handleStreetViewClick = (location: Location) => {
        if (location?.streetViewImage) setStreetViewLocation(location);
        else alert('No Street View image available for this location. Please upload one.');
    };
    
    const locationForAction = selectedLocation || hoveredLocation;

    return (
        <div className="w-screen h-screen overflow-hidden font-sans text-white bg-transparent">
             <FuturisticHeader activeTab={activeTab} onTabClick={setActiveTab} user={user} />
            
            {activeTab === 'Campus Map' && (
                <div className={`w-full h-full transition-opacity duration-300 ${isNavigatorVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <TopRightStatus />
                    <CampusDepartmentsPanel locations={locations} />
                    
                    <main className="w-full h-full">
                        <FuturisticMapContainer
                            locations={locations}
                            events={events}
                            selectedLocation={selectedLocation}
                            hoveredLocation={hoveredLocation}
                            onSelectLocation={handleSelectLocation}
                            onHoverLocation={setHoveredLocation}
                            onStreetViewClick={handleStreetViewClick}
                            isAddingLocation={isAddingLocation}
                            onMapClickForAddLocation={handleMapClickForAddLocation}
                            isAddingEvent={isAddingEvent}
                            onMapClickForAddEvent={handleMapClickForAddEvent}
                        />
                    </main>

                    <FloatingActionButtons
                        onToggleAddLocationMode={handleToggleAddLocationMode}
                        isAddingLocation={isAddingLocation}
                        onToggleAddEventMode={handleToggleAddEventMode}
                        isAddingEvent={isAddingEvent}
                        onUploadClick={() => setActiveTab('Upload 360°')}
                        onStreetViewClick={() => { locationForAction ? handleStreetViewClick(locationForAction) : setActiveTab('Street View'); }}
                        onToggleViewMode={onToggleViewMode}
                        onNavigateClick={() => setNavigatorVisible(true)}
                        onSettingsClick={() => setSettingsModalOpen(true)}
                        user={user}
                    />
                </div>
            )}
            
            {activeTab === 'Upload 360°' && user?.type === 'admin' && <Upload360Screen locations={locations} onUpdateLocationImage={handleUpdateLocationImage} />}
            {activeTab === '360 View' && user?.type !== 'admin' && <View360Screen locations={locations} onView={handleStreetViewClick} />}
            {activeTab === 'Street View' && <div className="flex items-center justify-center h-full text-center p-4 text-xl sm:text-2xl text-gray-400"><p>Select a location on the map to enter Street View.</p></div>}
            
            <ProfileMenu
                user={user}
                onSignUpClick={onOpenAuthModal}
                onSignOut={onSignOut}
                viewMode="futuristic"
                onOpenAdminSettingsModal={onOpenAdminSettingsModal}
            />

            <DepartmentNavigatorPanel isVisible={isNavigatorVisible} onClose={() => setNavigatorVisible(false)} locations={locations} />
            {streetViewLocation?.streetViewImage && <PannellumViewer imageSrc={streetViewLocation.streetViewImage} onClose={() => setStreetViewLocation(null)} />}
            {isAddLocationModalOpen && user?.type === 'admin' && <AddLocationModal icons={ICONS} onClose={() => { setAddLocationModalOpen(false); setIsAddingLocation(false); }} onSave={handleSaveNewLocation} isIconRequired={true} />}
            {isAddEventModalOpen && user?.type === 'admin' && <AddEventModal onClose={() => { setAddEventModalOpen(false); setIsAddingEvent(false); }} onSave={handleSaveNewEvent} />}
            {user?.type === 'admin' && <SettingsModal isVisible={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} locations={locations} events={events} onRemoveLocation={handleRemoveLocation} onRemoveEvent={handleRemoveEvent} />}
        </div>
    );
};

export default FuturisticApp;