import React, { useState } from 'react';

interface AddEventModalProps {
    onClose: () => void;
    onSave: (data: { name: string; description: string; }) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        if (name.trim()) {
            onSave({ name, description });
        }
    };

    const isSaveDisabled = !name.trim();

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg p-8 mx-4 bg-black/50 backdrop-blur-2xl rounded-2xl shadow-2xl border border-pink-500/30 text-gray-200" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]">
                    Add New Event
                </h3>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="event-name" className="block mb-1 font-medium">Event Name</label>
                        <input
                            id="event-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Tech Fest 'Tantra'"
                            className="w-full px-3 py-2 bg-black/30 rounded-lg border border-transparent text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-0"
                        />
                    </div>
                     <div>
                        <label htmlFor="event-desc" className="block mb-1 font-medium">Description</label>
                        <textarea
                            id="event-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="A short description of the event."
                            className="w-full px-3 py-2 bg-black/30 rounded-lg border border-transparent text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-0"
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-8 space-x-4">
                    <button onClick={onClose} className="w-full px-4 py-3 font-semibold text-gray-200 uppercase bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaveDisabled} className="w-full px-4 py-3 font-semibold text-white uppercase bg-gradient-to-r from-pink-500 to-red-500 rounded-lg hover:shadow-lg hover:shadow-pink-500/40 transition-shadow disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none">
                        Save Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEventModal;
