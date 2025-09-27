
import React, { useState } from 'react';

interface AddNoticeModalProps {
    onClose: () => void;
    onSave: (noticeData: { title: string; content: string }) => void;
}

const AddNoticeModal: React.FC<AddNoticeModalProps> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSave = () => {
        if (title && content) {
            onSave({ title, content });
            onClose();
        } else {
            alert('Please fill out all fields.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg p-8 mx-4 bg-gray-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-yellow-500/30 text-gray-200" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">Add Notice</h3>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="notice-title" className="block text-sm font-medium text-yellow-300 mb-1">Title</label>
                        <input
                            id="notice-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="e.g., Exam Schedule"
                        />
                    </div>
                    <div>
                        <label htmlFor="notice-content" className="block text-sm font-medium text-yellow-300 mb-1">Content</label>
                        <textarea
                            id="notice-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-2 h-32 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="Enter the notice details here..."
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button onClick={onClose} className="px-6 py-2 font-semibold text-gray-300 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 font-semibold text-white bg-yellow-600/80 rounded-lg hover:bg-yellow-500/80 transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNoticeModal;
