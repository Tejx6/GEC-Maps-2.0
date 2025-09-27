


import React, { useState } from 'react';

interface AuthModalProps {
    onClose: () => void;
    onSignInGuest: () => void;
    onLoginAdmin: (email: string, password: string) => Promise<boolean>;
    onSignUpAdmin: (email: string, password: string, name: string) => Promise<boolean>;
}

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

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
);


const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSignInGuest, onLoginAdmin, onSignUpAdmin }) => {
    const [view, setView] = useState<'select_role' | 'login' | 'signup'>('select_role');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [uniqueCode, setUniqueCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showUniqueCode, setShowUniqueCode] = useState(false);

    const ADMIN_CODE = 'GEC@123';

    const handleAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (uniqueCode !== ADMIN_CODE) {
            setError('Invalid Unique Code.');
            return;
        }
        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        setIsLoading(true);
        let success = false;
        try {
            if (view === 'login') {
                success = await onLoginAdmin(email, password);
                if (!success) {
                    setError('Invalid credentials or admin not found.');
                }
            } else if (view === 'signup') {
                 if (!name) {
                    setError('Name is required for sign up.');
                    setIsLoading(false);
                    return;
                }
                success = await onSignUpAdmin(email, password, name);
                if (!success) {
                    setError('An admin account already exists. Please login.');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
        
        if (success) {
            onClose();
        }
    };
    
    const handleSignInGuestClick = () => {
        onSignInGuest();
        onClose();
    };

    const renderRoleSelection = () => (
        <>
            <h3 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-[0_0_5px_rgba(0,200,255,0.5)]">
                Select Role
            </h3>
            <div className="space-y-4">
                <button
                    onClick={handleSignInGuestClick}
                    className="w-full flex items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-green-400/50 transition-all duration-300 group"
                >
                    <GuestIcon className="w-8 h-8 mr-4 text-green-400" />
                    <div>
                        <p className="font-semibold text-lg text-left text-white">Continue as Guest</p>
                        <p className="text-sm text-left text-gray-400">View the map and basic details.</p>
                    </div>
                </button>
                <button
                    onClick={() => setView('login')}
                    className="w-full flex items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-fuchsia-400/50 transition-all duration-300 group"
                >
                    <AdminIcon className="w-8 h-8 mr-4 text-fuchsia-400" />
                    <div>
                        <p className="font-semibold text-lg text-left text-white">Admin Access</p>
                        <p className="text-sm text-left text-gray-400">Login or sign up to manage content.</p>
                    </div>
                </button>
            </div>
            <div className="mt-8 text-center">
                <button onClick={onClose} className="px-6 py-2 font-semibold text-gray-300 bg-transparent rounded-lg hover:bg-white/10 transition-colors">
                    Cancel
                </button>
            </div>
        </>
    );

    const renderAdminForm = () => (
        <>
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => setView('select_role')} className="text-sm text-cyan-300 hover:underline">&larr; Back</button>
                <h3 className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(0,200,255,0.5)]">
                    Admin Access
                </h3>
                <div className="w-14"></div> {/* Spacer */}
            </div>
            <div className="p-1 bg-black/30 rounded-full flex items-center mb-6">
                <button onClick={() => { setView('login'); setError(''); }} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${view === 'login' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}>Login</button>
                <button onClick={() => { setView('signup'); setError(''); }} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${view === 'signup' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}>Sign Up</button>
            </div>
            <form onSubmit={handleAdminSubmit} className="space-y-4">
                {view === 'signup' && (
                    <div>
                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-300">Your Name</label>
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 bg-black/30 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"/>
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-300">Email Address</label>
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 bg-black/30 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"/>
                </div>
                <div className="relative">
                    <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-300">Password</label>
                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 bg-black/30 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-white">
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                </div>
                <div className="relative">
                    <label htmlFor="code" className="block mb-1 text-sm font-medium text-gray-300">Unique Code</label>
                    <input id="code" type={showUniqueCode ? 'text' : 'password'} value={uniqueCode} onChange={e => setUniqueCode(e.target.value)} placeholder="Enter admin access code" required className="w-full px-3 py-2 bg-black/30 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"/>
                    <button type="button" onClick={() => setShowUniqueCode(!showUniqueCode)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-white">
                        {showUniqueCode ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                </div>
                {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}
                <div className="pt-4">
                    <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white uppercase bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none">
                        {isLoading ? 'Processing...' : (view === 'login' ? 'Login' : 'Sign Up')}
                    </button>
                </div>
            </form>
        </>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="relative w-full max-w-md p-8 mx-4 bg-black/50 backdrop-blur-2xl rounded-2xl shadow-2xl border border-cyan-500/30 text-gray-200"
                onClick={e => e.stopPropagation()}
            >
                {view === 'select_role' ? renderRoleSelection() : renderAdminForm()}
            </div>
        </div>
    );
};

export default AuthModal;