import React from 'react';
import ThemeToggle from './ThemeToggle';
import type { Theme, Location, User } from '../types';

interface HeaderProps {
    theme: Theme;
    toggleTheme: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    searchResults: Location[];
    onSearchResultClick: (location: Location) => void;
    isAddingLocation: boolean;
    onToggleAddLocationMode: () => void;
    isAddingEvent: boolean;
    onToggleAddEventMode: () => void;
    onManageEventsClick: () => void;
    onToggleViewMode: () => void;
    user: User;
}

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const CalendarPlusIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008zm0 3.75h.008v.008H12v-.008zm0 3.75h.008v.008H12v-.008zM12 9h.008v.008H12V9zm-3.75 3.75h.008v.008H8.25v-.008zm0 3.75h.008v.008H8.25v-.008zm0-7.5h.008v.008H8.25V9zm3.75 0h.008v.008H12V9zm3.75 0h.008v.008h-.008V9zm0 3.75h.008v.008h-.008v-.008zm0 3.75h.008v.008h-.008v-.008zM12 9v12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75v8.25m0 0H9m3 0h3" />
    </svg>
);

const WrenchScrewdriverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 000-4.773L6.75 2.25 2.25 6.75l7.725 7.725a3.375 3.375 0 004.773 0z" />
    </svg>
);


const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.455-2.456L12.75 18l1.178-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, searchQuery, onSearchChange, searchResults, onSearchResultClick, isAddingLocation, onToggleAddLocationMode, isAddingEvent, onToggleAddEventMode, onManageEventsClick, onToggleViewMode, user }) => {
    return (
        <header className="absolute top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 p-2 md:grid md:grid-cols-3 md:gap-4 md:p-4">
            <div className="flex items-center gap-2 sm:gap-4 md:col-span-1 md:justify-self-start flex-wrap">
                <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-black/20 backdrop-blur-md shadow-lg border border-white/10">
                    <h1 className="text-base sm:text-xl font-bold tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                        GEC Campus Navigator
                    </h1>
                </div>
                {user?.type === 'admin' && (
                    <>
                        <button 
                            onClick={onToggleAddLocationMode}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg backdrop-blur-md shadow-lg flex items-center gap-2 transition-all duration-300 text-white border ${
                                isAddingLocation 
                                ? 'bg-fuchsia-500/30 border-fuchsia-400/80 ring-2 ring-fuchsia-400/50'
                                : 'bg-cyan-400/20 border-cyan-400/30 hover:bg-cyan-400/40 hover:border-cyan-400'
                            }`}
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">{isAddingLocation ? 'Cancel' : 'Add Location'}</span>
                        </button>
                        <button 
                            onClick={onToggleAddEventMode}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg backdrop-blur-md shadow-lg flex items-center gap-2 transition-all duration-300 text-white border ${
                                isAddingEvent 
                                ? 'bg-fuchsia-500/30 border-fuchsia-400/80 ring-2 ring-fuchsia-400/50'
                                : 'bg-pink-400/20 border-pink-400/30 hover:bg-pink-400/40 hover:border-pink-400'
                            }`}
                        >
                            <CalendarPlusIcon className="w-5 h-5" />
                             <span className="hidden sm:inline">{isAddingEvent ? 'Cancel' : 'Add Event'}</span>
                        </button>
                    </>
                )}
                {(isAddingLocation || isAddingEvent) && user?.type === 'admin' && (
                    <p className="hidden md:block text-sm font-medium text-cyan-200 bg-black/30 px-3 py-1 rounded-full animate-pulse">
                        Click on the map to place a new point
                    </p>
                )}
            </div>

            <div className="w-full order-3 md:w-full md:max-w-md md:order-2 md:col-span-1 md:justify-self-center">
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a location..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/20 backdrop-blur-md shadow-lg text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    />
                    {searchResults.length > 0 && searchQuery && (
                        <ul className="absolute mt-2 w-full bg-black/40 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden z-30 border border-white/10">
                            {searchResults.map(location => (
                                <li
                                    key={location.id}
                                    onClick={() => onSearchResultClick(location)}
                                    className="px-4 py-2 cursor-pointer text-gray-200 hover:bg-cyan-500/30 transition-colors"
                                >
                                    {location.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 order-2 md:order-3 md:col-span-1 md:justify-self-end">
                {user?.type === 'admin' && (
                    <button 
                        onClick={onManageEventsClick}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg backdrop-blur-md shadow-lg flex items-center gap-2 transition-all duration-300 text-white border bg-gray-500/20 border-gray-400/30 hover:bg-gray-500/40 hover:border-gray-400"
                    >
                        <WrenchScrewdriverIcon className="w-5 h-5" />
                        <span className="hidden lg:inline">Manage Events</span>
                    </button>
                )}
                 <button 
                    onClick={onToggleViewMode}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg backdrop-blur-md shadow-lg flex items-center gap-2 transition-all duration-300 text-white border bg-indigo-500/20 border-indigo-400/30 hover:bg-indigo-500/40 hover:border-indigo-400"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span className="hidden lg:inline">Futuristic View</span>
                </button>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </header>
    );
};

export default Header;