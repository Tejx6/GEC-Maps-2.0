
import React, { useState } from 'react';

interface AddFacultyModalProps {
    onClose: () => void;
    onSave: (facultyData: { name: string; department: string; email: string }) => void;
}

const AddFacultyModal: React.FC<AddFacultyModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');

    const handleSave = () => {
        if (name && department && email) {
            onSave({ name, department, email });
            onClose();
        } else {
            alert('Please fill out all fields.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg p-8 mx-4 bg-gray-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-cyan-500/30 text-gray-200" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Add Faculty Member</h3>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="faculty-name" className="block text-sm font-medium text-cyan-300 mb-1">Name</label>
                        <input
                            id="faculty-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="e.g., Dr. John Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="faculty-dept" className="block text-sm font-medium text-cyan-300 mb-1">Department</label>
                        <input
                            id="faculty-dept"
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="e.g., Computer Science"
                        />
                    </div>
                    <div>
                        <label htmlFor="faculty-email" className="block text-sm font-medium text-cyan-300 mb-1">Email</label>
                        <input
                            id="faculty-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="e.g., john.doe@example.com"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button onClick={onClose} className="px-6 py-2 font-semibold text-gray-300 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 font-semibold text-white bg-cyan-600/80 rounded-lg hover:bg-cyan-500/80 transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFacultyModal;
