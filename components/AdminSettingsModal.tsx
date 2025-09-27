import React, { useState } from 'react';
import type { User } from '../types';

interface AdminSettingsModalProps {
    user: User;
    onClose: () => void;
    onSave: (data: { name: string; newPassword?: string; currentPassword: string }) => Promise<{ success: boolean; message: string }>;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user?.name || '');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!currentPassword) {
            setError('Current password is required to save changes.');
            return;
        }
        setError('');
        setSuccess('');
        setIsLoading(true);
        
        const result = await onSave({ 
            name, 
            newPassword: newPassword || undefined, 
            currentPassword 
        });

        setIsLoading(false);
        if (result.success) {
            setSuccess(result.message);
            // Optionally close after a delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-lg p-8 mx-4 bg-black/50 backdrop-blur-2xl rounded-2xl shadow-2xl border border-cyan-500/30 text-gray-200" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-[0_0_5px_rgba(0,200,255,0.5)]">
                    Admin Settings
                </h3>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="admin-name" className="block mb-1 font-medium">Display Name</label>
                        <input id="admin-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-black/30 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"/>
                    </div>
                    <div>
                        <label htmlFor="new-password" className="block mb-1 font-medium">New Password (optional)</label>
                        <input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current password" className="w-full px-3 py-2 bg-black/30 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"/>
                    </div>
                    <hr className="border-gray-700 !my-6"/>
                    <div>
                        <label htmlFor="current-password" className="block mb-1 font-medium text-cyan-300">Current Password (for verification)</label>
                        <input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="Enter your current password" className="w-full px-3 py-2 bg-black/30 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"/>
                    </div>
                </div>
                
                {error && <p className="text-red-400 text-sm text-center pt-4">{error}</p>}
                {success && <p className="text-green-400 text-sm text-center pt-4">{success}</p>}

                <div className="flex justify-between mt-8 space-x-4">
                    <button onClick={onClose} className="w-full px-4 py-3 font-semibold text-gray-200 uppercase bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isLoading || !currentPassword} className="w-full px-4 py-3 font-semibold text-white uppercase bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsModal;
