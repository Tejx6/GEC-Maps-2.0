import React from 'react';
import type { User } from '../../types';

// --- Icon Components --- //
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);
const CalendarPlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75M3 18.75h18" />
    </svg>
);
const NavigateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);
const StreetViewIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);
const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226l.554-.221a2.25 2.25 0 012.387 2.387l-.221.554c-.219.55-.684 1.02-1.226 1.11a21.042 21.042 0 00-4.136 4.136c-.09.542-.56 1.007-1.11 1.226l-.554.221a2.25 2.25 0 01-2.387-2.387l.221-.554c.219-.55.684-1.02 1.226-1.11a21.042 21.042 0 004.136-4.136zM14.25 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-1.065 0-2.098.44-2.843 1.187C8.4 14.687 8 15.657 8 16.75V18a2.25 2.25 0 002.25 2.25h3.5A2.25 2.25 0 0016 18v-1.25c0-1.093-.4-2.063-1.157-2.813A4.505 4.505 0 0012 12.75z" />
    </svg>
);
const SwitchViewIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.695v-2.695A8.25 8.25 0 005.68 9.348v2.695l-2.695 2.695" />
    </svg>
);


interface FloatingActionButtonsProps {
    onToggleAddLocationMode: () => void;
    isAddingLocation: boolean;
    onToggleAddEventMode: () => void;
    isAddingEvent: boolean;
    onUploadClick: () => void;
    onStreetViewClick: () => void;
    onToggleViewMode: () => void;
    onNavigateClick: () => void;
    onSettingsClick: () => void;
    user: User;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({ 
    onToggleAddLocationMode, isAddingLocation, onToggleAddEventMode, isAddingEvent,
    onUploadClick, onStreetViewClick, onToggleViewMode, onNavigateClick, onSettingsClick, user
}) => {
    const baseButtonClass = "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 transition-all duration-300 group shadow-lg";
    const hoverClass = "hover:border-cyan-400/50 hover:text-cyan-300 hover:scale-110";

    const Tooltip = ({ text }: { text: string }) => (
        <div className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900/80 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden lg:block">
            {text}
        </div>
    );
    
    return (
        <div className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-10 flex flex-col items-center gap-4">
            <div className="p-2 bg-black/20 backdrop-blur-lg rounded-full border border-white/10 flex flex-col gap-3">
                 <button onClick={onToggleViewMode} className={`${baseButtonClass} ${hoverClass}`}><SwitchViewIcon className="w-6 h-6 sm:w-7 sm:h-7" /><Tooltip text="Classic View" /></button>
                 <button onClick={onNavigateClick} className={`${baseButtonClass} ${hoverClass}`}><NavigateIcon className="w-6 h-6 sm:w-7 sm:h-7" /><Tooltip text="Navigate" /></button>
                 <button onClick={onStreetViewClick} className={`${baseButtonClass} ${hoverClass}`}><StreetViewIcon className="w-6 h-6 sm:w-7 sm:h-7" /><Tooltip text="Street View" /></button>
                 {user?.type === 'admin' && (
                    <>
                        <button onClick={onUploadClick} className={`${baseButtonClass} ${hoverClass}`}><UploadIcon className="w-6 h-6 sm:w-7 sm:h-7" /><Tooltip text="Upload 360°" /></button>
                        <button onClick={onSettingsClick} className={`${baseButtonClass} ${hoverClass}`}><SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7" /><Tooltip text="Settings" /></button>
                    </>
                 )}
            </div>
            
            {user?.type === 'admin' && (
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onToggleAddEventMode}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 transition-all duration-300 transform hover:scale-110 ${isAddingEvent ? 'rotate-45' : ''}`}
                        aria-label={isAddingEvent ? 'Cancel Add Event' : 'Add New Event'}
                    >
                        <CalendarPlusIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                        <Tooltip text={isAddingEvent ? 'Cancel' : 'Add New Event'} />
                    </button>
                    <button 
                        onClick={onToggleAddLocationMode}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-110 ${isAddingLocation ? 'rotate-45' : ''}`}
                        aria-label={isAddingLocation ? 'Cancel Add Location' : 'Add New Location'}
                    >
                        <PlusIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                        <Tooltip text={isAddingLocation ? 'Cancel' : 'Add New Location'} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FloatingActionButtons;