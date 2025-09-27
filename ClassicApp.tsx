
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import MapContainer from './components/MapContainer';
import LocationDetailsPanel from './components/LocationDetailsPanel';
import PannellumViewer from './components/PannellumViewer';
import UploadModal from './components/UploadModal';
import AddLocationModal from './components/AddLocationModal';
import AddEventModal from './components/AddEventModal';
import EventsPanel from './components/EventsPanel';
import ReviewModal from './components/ReviewModal';
import AddFacultyModal from './components/AddFacultyModal';
import AddNoticeModal from './components/AddNoticeModal';
import ProfileMenu from './components/ProfileMenu';
import { useTheme } from './hooks/useTheme';
import type { Location, Event, User, Review, Faculty, Notice } from './types';
import { ICONS } from './constants';

interface ClassicAppProps {
    onToggleViewMode: () => void;
    locations: Location[];
    events: Event[];
    user: User | null;
    onUpdateLocation: (location: Location) => void;
    onAddLocation: (data: Partial<Location>, coords: { x: number; y: number }) => void;
    onDeleteLocation: (locationId: string) => void;
    onAddEvent: (data: { name: string; description: string; }, coords: { x: number; y: number }) => void;
    onDeleteEvent: (eventId: string) => void;
    onAddReview: (locationId: string, reviewData: { rating: number; comment: string; }) => void;
    onDeleteReview: (locationId: string, reviewId: string) => void;
    onAddFaculty: (locationId: string, facultyData: { name: string; department: string; email: string }) => void;
    onDeleteFaculty: (locationId: string, facultyId: string) => void;
    onAddNotice: (locationId: string, noticeData: { title: string; content: string }) => void;
    onDeleteNotice: (locationId: string, noticeId: string) => void;
    onOpenAuthModal: () => void;
    onSignOut: () => void;
    onOpenAdminSettingsModal: () => void;
}

interface ManageEventsModalProps {
    isVisible: boolean;
    onClose: () => void;
    events: Event[];
    onRemove: (eventId: string) => void;
}

const ManageEventsModal: React.FC<ManageEventsModalProps> = ({ isVisible, onClose, events, onRemove }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg p-8 mx-4 bg-black/50 backdrop-blur-2xl rounded-2xl shadow-2xl border border-pink-500/30 text-gray-200" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]">Manage Events</h3>
                <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
                    {events.length > 0 ? (
                        events.map(event => (
                            <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div>
                                    <p className="font-semibold">{event.name}</p>
                                    <p className="text-sm text-gray-400">{event.description}</p>
                                </div>
                                <button
                                    onClick={() => onRemove(event.id)}
                                    className="px-3 py-1 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-full hover:bg-red-500/30 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-8">No events have been added yet.</p>
                    )}
                </div>
                <button onClick={onClose} className="w-full mt-8 px-4 py-3 font-semibold text-white uppercase bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    Done
                </button>
            </div>
        </div>
    );
};


const ClassicApp: React.FC<ClassicAppProps> = ({ 
    onToggleViewMode, locations, events, user,
    onUpdateLocation, onAddLocation, onDeleteLocation, onAddEvent, onDeleteEvent, 
    onAddReview, onDeleteReview, onAddFaculty, onDeleteFaculty, onAddNotice, onDeleteNotice,
    onOpenAuthModal, onSignOut, onOpenAdminSettingsModal
}) => {
    const [theme, toggleTheme] = useTheme();
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isStreetViewVisible, setStreetViewVisible] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Location[]>([]);

    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [isAddLocationModalOpen, setAddLocationModalOpen] = useState(false);
    const [newLocationCoords, setNewLocationCoords] = useState<{ x: number; y: number } | null>(null);
    const [locationToEdit, setLocationToEdit] = useState<Location | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [isAddFacultyModalOpen, setAddFacultyModalOpen] = useState(false);
    const [isAddNoticeModalOpen, setAddNoticeModalOpen] = useState(false);

    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
    const [newEventCoords, setNewEventCoords] = useState<{ x: number; y: number } | null>(null);
    const [isManageEventsModalOpen, setManageEventsModalOpen] = useState(false);

    useEffect(() => {
        if (selectedLocation) {
            const updatedLocationFromProps = locations.find(loc => loc.id === selectedLocation.id);
            if (updatedLocationFromProps && updatedLocationFromProps !== selectedLocation) {
                setSelectedLocation(updatedLocationFromProps);
            } else if (!updatedLocationFromProps) {
                setSelectedLocation(null);
            }
        }
    }, [locations, selectedLocation]);

    const handleSelectLocation = useCallback((location: Location | null) => {
        if (isAddingLocation || isAddingEvent) return;
        setSelectedLocation(location);
    }, [isAddingLocation, isAddingEvent]);

    const handleUpdateLocationImage = (locationId: string, imageUrl: string) => {
        const locationToUpdate = locations.find(loc => loc.id === locationId);
        if (locationToUpdate) {
            const updatedLocation = { ...locationToUpdate, streetViewImage: imageUrl };
            onUpdateLocation(updatedLocation);
        }
        setUploadModalOpen(false);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }
        const filtered = locations.filter(loc =>
            loc.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
    };

    const handleSelectSearchResult = (location: Location) => {
        handleSelectLocation(location);
        setSearchQuery('');
        setSearchResults([]);
    };
    
    const handleToggleAddLocationMode = () => {
        setIsAddingLocation(prev => !prev);
        setIsAddingEvent(false);
        setSelectedLocation(null);
    };
    const handleMapClickForAddLocation = (coords: { x: number; y: number }) => {
        setNewLocationCoords(coords);
        setAddLocationModalOpen(true);
    };
    const handleEditClick = () => {
        if (selectedLocation) {
            setLocationToEdit(selectedLocation);
            setEditModalOpen(true);
        }
    };
    const handleSaveLocation = async (data: Partial<Location>) => {
        if (locationToEdit && onUpdateLocation) { // Edit mode
            const updatedLocation = { ...locationToEdit, ...data };
            onUpdateLocation(updatedLocation);
        } else if (newLocationCoords) { // Add mode
            onAddLocation(data, newLocationCoords);
        }

        setAddLocationModalOpen(false);
        setEditModalOpen(false);
        setIsAddingLocation(false);
        setNewLocationCoords(null);
        setLocationToEdit(null);
    };
    
    const handleToggleAddEventMode = () => {
        setIsAddingEvent(prev => !prev);
        setIsAddingLocation(false);
        setSelectedLocation(null);
    };
    const handleMapClickForAddEvent = (coords: { x: number; y: number }) => {
        setNewEventCoords(coords);
        setAddEventModalOpen(true);
    };
    const handleSaveEvent = (data: { name: string; description: string }) => {
        if (newEventCoords) {
            onAddEvent(data, newEventCoords);
        }
        setAddEventModalOpen(false); setIsAddingEvent(false); setNewEventCoords(null);
    };

    const handleSaveReview = (reviewData: { rating: number; comment: string; }) => {
        if (!selectedLocation || !user) return;
        onAddReview(selectedLocation.id, reviewData);
        setReviewModalOpen(false);
    };
    
    const handleSaveFaculty = (facultyData: { name: string; department: string; email: string }) => {
        if (!selectedLocation) return;
        onAddFaculty(selectedLocation.id, facultyData);
        setAddFacultyModalOpen(false);
    };

    const handleSaveNotice = (noticeData: { title: string; content: string }) => {
        if (!selectedLocation) return;
        onAddNotice(selectedLocation.id, noticeData);
        setAddNoticeModalOpen(false);
    };

    const isAddEditModalOpen = isAddLocationModalOpen || isEditModalOpen;

    return (
        <div className={`w-screen h-screen overflow-hidden flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
            <Header 
                theme={theme} 
                toggleTheme={toggleTheme} 
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchResults={searchResults}
                onSearchResultClick={handleSelectSearchResult}
                isAddingLocation={isAddingLocation}
                onToggleAddLocationMode={handleToggleAddLocationMode}
                isAddingEvent={isAddingEvent}
                onToggleAddEventMode={handleToggleAddEventMode}
                onManageEventsClick={() => setManageEventsModalOpen(true)}
                onToggleViewMode={onToggleViewMode}
                user={user}
            />
            <main className="flex-grow relative">
                <MapContainer
                    locations={locations}
                    events={events}
                    selectedLocation={selectedLocation}
                    onSelectLocation={handleSelectLocation}
                    highlightedLocations={searchResults}
                    onBackgroundClick={() => handleSelectLocation(null)}
                    isAddingLocation={isAddingLocation}
                    onMapClickForAddLocation={handleMapClickForAddLocation}
                    isAddingEvent={isAddingEvent}
                    onMapClickForAddEvent={handleMapClickForAddEvent}
                />
                <EventsPanel events={events} />
                <LocationDetailsPanel
                    location={selectedLocation}
                    user={user}
                    onClearSelection={() => handleSelectLocation(null)}
                    onStreetViewClick={() => setStreetViewVisible(true)}
                    onUploadClick={() => setUploadModalOpen(true)}
                    onEditClick={handleEditClick}
                    onAddReviewClick={() => setReviewModalOpen(true)}
                    onAddFacultyClick={() => setAddFacultyModalOpen(true)}
                    onAddNoticeClick={() => setAddNoticeModalOpen(true)}
                    onDeleteReview={(reviewId) => selectedLocation && onDeleteReview(selectedLocation.id, reviewId)}
                    onDeleteFaculty={(facultyId) => selectedLocation && onDeleteFaculty(selectedLocation.id, facultyId)}
                    onDeleteNotice={(noticeId) => selectedLocation && onDeleteNotice(selectedLocation.id, noticeId)}
                />
            </main>

            {isStreetViewVisible && selectedLocation?.streetViewImage && <PannellumViewer imageSrc={selectedLocation.streetViewImage} onClose={() => setStreetViewVisible(false)} />}
            {isUploadModalOpen && selectedLocation && user?.type === 'admin' && <UploadModal location={selectedLocation} onClose={() => setUploadModalOpen(false)} onSave={handleUpdateLocationImage} />}
            {isAddEditModalOpen && user?.type === 'admin' && <AddLocationModal icons={ICONS} onClose={() => { setAddLocationModalOpen(false); setEditModalOpen(false); setIsAddingLocation(false); setLocationToEdit(null); }} onSave={handleSaveLocation} locationToEdit={locationToEdit} />}
            
            {isReviewModalOpen && selectedLocation && <ReviewModal location={selectedLocation} onClose={() => setReviewModalOpen(false)} onSave={handleSaveReview} user={user} />}
            {isAddFacultyModalOpen && selectedLocation && <AddFacultyModal onClose={() => setAddFacultyModalOpen(false)} onSave={handleSaveFaculty} />}
            {isAddNoticeModalOpen && selectedLocation && <AddNoticeModal onClose={() => setAddNoticeModalOpen(false)} onSave={handleSaveNotice} />}

            {isAddEventModalOpen && user?.type === 'admin' && <AddEventModal onClose={() => { setAddEventModalOpen(false); setIsAddingEvent(false); }} onSave={handleSaveEvent} />}
            {user?.type === 'admin' && <ManageEventsModal isVisible={isManageEventsModalOpen} onClose={() => setManageEventsModalOpen(false)} events={events} onRemove={onDeleteEvent} />}
            
            <ProfileMenu
                user={user}
                onSignUpClick={onOpenAuthModal}
                onSignOut={onSignOut}
                viewMode="classic"
                onOpenAdminSettingsModal={onOpenAdminSettingsModal}
            />
        </div>
    );
};

export default ClassicApp;
