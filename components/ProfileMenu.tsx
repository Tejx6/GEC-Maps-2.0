



import React, { useState, useRef, useEffect } from 'react';
import type { User, ViewMode } from '../types';

interface ProfileMenuProps {
    user: User;
    onSignUpClick: () => void;
    onSignOut: () => void;
    viewMode: ViewMode;
    onOpenAdminSettingsModal?: () => void;
}

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const GuestIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.455-2.456L12.75 18l1.178-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

const AdminIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 000-4.773L6.75 2.25 2.25 6.75l7.725 7.725a3.375 3.375 0 004.773 0z" />
    </svg>
);

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, onSignUpClick, onSignOut, viewMode, onOpenAdminSettingsModal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = () => {
        onSignOut();
        setIsOpen(false);
    };

    const classicStyles = {
        button: 'bg-black/20 backdrop-blur-md shadow-lg border border-white/10 text-white',
        menu: 'bg-black/40 backdrop-blur-xl border-white/10',
        menuItem: 'hover:bg-cyan-500/30'
    };
    const futuristicStyles = {
        button: 'bg-black/30 backdrop-blur-md border border-white/10 text-gray-300 hover:border-cyan-400/50 hover:text-cyan-300',
        menu: 'bg-gray-900/80 backdrop-blur-xl border-cyan-400/20',
        menuItem: 'hover:bg-cyan-500/20'
    };

    const styles = viewMode === 'classic' ? classicStyles : futuristicStyles;

    const ProfileIcon = user ? (user.type === 'admin' ? AdminIcon : GuestIcon) : UserIcon;
    const profileColor = user ? (user.type === 'admin' ? 'text-fuchsia-400' : 'text-green-400') : 'text-white';

    return (
        <div ref={menuRef} className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-30">
            {isOpen && (
                <div className={`absolute bottom-full right-0 mb-3 w-60 p-2 rounded-lg border shadow-2xl animate-fade-in-up ${styles.menu}`}>
                    {user ? (
                        <>
                            <div className="px-3 py-2">
                                <p className="text-sm text-gray-400">Signed in as</p>
                                <p className={`font-semibold truncate ${profileColor}`}>{user.name} ({user.type})</p>
                            </div>
                            <hr className="border-gray-700 my-1"/>
                            {user.type === 'admin' && onOpenAdminSettingsModal && (
                                <button onClick={() => { onOpenAdminSettingsModal(); setIsOpen(false); }} className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${styles.menuItem}`}>
                                    Settings
                                </button>
                            )}
                            <button onClick={handleSignOut} className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${styles.menuItem}`}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button onClick={() => { onSignUpClick(); setIsOpen(false); }} className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${styles.menuItem}`}>
                            Admin / Guest Sign Up
                        </button>
                    )}
                </div>
            )}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${styles.button}`}
                aria-label="Profile"
            >
                <ProfileIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${profileColor}`} />
            </button>
        </div>
    );
};

export default ProfileMenu;