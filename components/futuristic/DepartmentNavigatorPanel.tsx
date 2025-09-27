import React, { useState, useMemo } from 'react';
import type { Location } from '../../types';
import { ComputerIcon } from '../../constants'; // Using an existing icon as a placeholder

// --- Internal Icon Components --- //
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const LocationMarkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


interface DepartmentCardProps {
    location: Location;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ location }) => {
    const handleShare = async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?location=${location.id}&view=futuristic`;
        const shareData = {
            title: 'GCE Campus Navigator',
            text: `Check out ${location.name} at Goa College of Engineering!`,
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing location:', err);
             if ((err as Error).name !== 'AbortError') {
                 alert('Could not share location.');
            }
        }
    };
    
    return (
        <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/80 hover:border-cyan-400/50 transition-colors duration-300 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-cyan-400">
                        <ComputerIcon />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{location.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            {location.shortName && <span className="font-semibold text-gray-300">{location.shortName}</span>}
                            {location.rating && <><span>•</span><div className="flex items-center gap-1"><StarIcon /> {location.rating}</div></>}
                        </div>
                    </div>
                </div>
                <button onClick={handleShare} className="text-gray-400 hover:text-white"><ShareIcon /></button>
            </div>
            {/* Details */}
            <p className="text-gray-300 text-sm">{location.description}</p>
            <div className="text-sm text-gray-300 space-y-1.5">
                {location.building && <div className="flex items-center"><LocationMarkerIcon /> {location.building}</div>}
                {location.timings && <div className="flex items-center"><ClockIcon /> {location.timings}</div>}
            </div>
            {/* Tags */}
            {location.tags && location.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {location.tags.slice(0, 3).map(tag => <span key={tag} className="px-3 py-1 bg-purple-600/40 text-purple-200 text-xs font-medium rounded-full">{tag}</span>)}
                    {location.tags.length > 3 && <span className="px-3 py-1 bg-gray-600/40 text-gray-200 text-xs font-medium rounded-full">+{location.tags.length - 3} more</span>}
                </div>
            )}
            {/* Actions */}
            <div className="flex items-center gap-2 mt-2">
                {location.phone && <button className="flex-1 flex items-center justify-center text-sm p-2 bg-gray-700/70 hover:bg-gray-700 rounded-lg transition-colors"><PhoneIcon /> Call</button>}
                {location.email && <button className="flex-1 flex items-center justify-center text-sm p-2 bg-gray-700/70 hover:bg-gray-700 rounded-lg transition-colors"><MailIcon /> Email</button>}
            </div>
        </div>
    );
};


interface DepartmentNavigatorPanelProps {
    isVisible: boolean;
    onClose: () => void;
    locations: Location[];
}

const DepartmentNavigatorPanel: React.FC<DepartmentNavigatorPanelProps> = ({ isVisible, onClose, locations }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLocations = useMemo(() => {
        if (!searchQuery) return locations;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return locations.filter(loc => 
            loc.name.toLowerCase().includes(lowerCaseQuery) ||
            loc.description.toLowerCase().includes(lowerCaseQuery) ||
            loc.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
        );
    }, [locations, searchQuery]);

    return (
        <div className={`absolute top-0 left-0 h-full w-full md:w-[420px] max-w-full z-30 transform transition-transform duration-500 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full w-full bg-black/50 p-2 md:p-4 backdrop-blur-2xl border-r border-gray-800 flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0 p-2">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-white">Department Navigator</h2>
                                <p className="text-xs md:text-sm text-gray-400">Explore campus facilities</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"><CloseIcon /></button>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <div className="relative">
                            <span className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-60"></span>
                            <span className="relative px-4 py-1.5 text-sm font-medium bg-purple-600 rounded-full border border-purple-400">{locations.length} Locations</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mt-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                        <input 
                            type="text"
                            placeholder="Search departments, labs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-grow pt-4 overflow-y-auto pr-1 space-y-3">
                    {filteredLocations.length > 0 ? (
                        filteredLocations.map(location => <DepartmentCard key={location.id} location={location} />)
                    ) : (
                        <p className="text-center text-gray-400 mt-8">No locations found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentNavigatorPanel;