import React from 'react';
import type { User, FuturisticTab } from '../../types';

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

interface FuturisticHeaderProps {
    activeTab: FuturisticTab;
    onTabClick: (tab: FuturisticTab) => void;
    user: User;
}


const FuturisticHeader: React.FC<FuturisticHeaderProps> = ({ activeTab, onTabClick, user }) => {
    // Show '360 View' for guests/logged-out users, and 'Upload 360°' for admins.
    const tabs: FuturisticTab[] = user?.type === 'admin'
        ? ['Campus Map', 'Street View', 'Upload 360°']
        : ['Campus Map', '360 View', 'Street View'];

    return (
        <header className="absolute top-0 left-0 right-0 z-20 p-2 lg:p-4 flex flex-col lg:grid lg:grid-cols-3 items-center gap-2 lg:gap-0">
            {/* Left Side: Title */}
            <div className="w-full lg:w-auto flex items-center gap-3 lg:col-span-1 lg:justify-self-start">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <LocationIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-300 text-transparent bg-clip-text">GCE Campus Navigator</h1>
                    <p className="text-xs lg:text-sm text-gray-400 hidden sm:block">Goa College of Engineering, Ponda</p>
                </div>
            </div>

            {/* Center: Navigation Tabs */}
            <div className="w-full lg:w-auto lg:col-span-1 lg:justify-self-center flex items-center p-1 bg-black/30 backdrop-blur-md rounded-full border border-white/10 shadow-lg overflow-x-auto">
                {tabs.map(tab => (
                     <button 
                        key={tab} 
                        onClick={() => onTabClick(tab)}
                        className={`relative px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-colors flex-shrink-0 ${
                            activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {activeTab === tab && (
                            <span
                                style={{ borderRadius: '9999px' }}
                                className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500"
                            ></span>
                        )}
                        <span className="relative z-10">{tab}</span>
                     </button>
                ))}
            </div>
            
            {/* Right side placeholder for balance */}
            <div className="hidden lg:block lg:col-span-1"></div>
        </header>
    );
};

export default FuturisticHeader;