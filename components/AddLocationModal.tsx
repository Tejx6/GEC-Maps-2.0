import React, { useState, useEffect } from 'react';
import type { Location, FacultyMember, Notice, Review } from '../types';

interface IconInfo {
    id: string;
    name: string;
    component: React.FC;
}

interface AddLocationModalProps {
    icons: IconInfo[];
    onClose: () => void;
    onSave: (data: any) => void;
    isIconRequired?: boolean;
    locationToEdit?: Location | null;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);


const AddLocationModal: React.FC<AddLocationModalProps> = ({ icons, onClose, onSave, isIconRequired = true, locationToEdit }) => {
    const isEditing = !!locationToEdit;

    // Unified state for form data
    const [formData, setFormData] = useState<Partial<Location>>({});
    const [activeTab, setActiveTab] = useState<'details' | 'faculty' | 'notices' | 'reviews'>('details');

    useEffect(() => {
        if (isEditing && locationToEdit) {
            setFormData(JSON.parse(JSON.stringify(locationToEdit))); // Deep copy
            setActiveTab('details');
        } else {
            setFormData({ name: '', description: '', iconId: '' });
        }
    }, [locationToEdit, isEditing]);

    const handleSave = () => {
        if (isEditing) {
            if (formData.name?.trim() && (formData.iconId || !isIconRequired)) {
                onSave(formData);
            }
        } else {
            if (formData.name?.trim() && (formData.iconId || !isIconRequired)) {
                onSave(formData);
            }
        }
    };

    const handleFormChange = (field: keyof Location, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayItemChange = (arrayName: 'faculty' | 'notices' | 'reviews', index: number, field: string, value: any) => {
        setFormData(prev => {
            const newArray = [...(prev[arrayName] || [])] as any[];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayName]: newArray };
        });
    };
    
    const addArrayItem = (arrayName: 'faculty' | 'notices' | 'reviews') => {
        const newItem = arrayName === 'faculty' ? { id: `f_${Date.now()}`, name: '', title: '', email: '' }
                      : arrayName === 'notices' ? { id: `n_${Date.now()}`, title: '', content: '', date: new Date().toISOString().split('T')[0] }
                      : { id: `r_${Date.now()}`, author: '', rating: 3, comment: '', date: new Date().toISOString().split('T')[0] };

        setFormData(prev => ({ ...prev, [arrayName]: [...(prev[arrayName] || []), newItem] }));
    };

    const removeArrayItem = (arrayName: 'faculty' | 'notices' | 'reviews', index: number) => {
        setFormData(prev => ({ ...prev, [arrayName]: (prev[arrayName] || []).filter((_, i) => i !== index) }));
    };


    const isSaveDisabled = !formData.name?.trim() || (isIconRequired && !formData.iconId);

    const renderDetailsTab = () => (
        <div className="space-y-4">
            <div>
                <label htmlFor="location-name" className="block mb-1 font-medium">Location Name</label>
                <input id="location-name" type="text" value={formData.name || ''} onChange={(e) => handleFormChange('name', e.target.value)} placeholder="e.g., Computer Engineering Dept." className="w-full px-3 py-2 bg-black/30 rounded-lg border border-transparent text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-0"/>
            </div>
            <div>
                <label htmlFor="location-desc" className="block mb-1 font-medium">Description</label>
                <textarea id="location-desc" value={formData.description || ''} onChange={(e) => handleFormChange('description', e.target.value)} rows={3} placeholder="A short description of the location." className="w-full px-3 py-2 bg-black/30 rounded-lg border border-transparent text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-0"/>
            </div>
            {isIconRequired && (
                <div>
                    <label className="block mb-2 font-medium">Select an Icon</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {icons.map(icon => (
                            <button key={icon.id} onClick={() => handleFormChange('iconId', icon.id)} className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${formData.iconId === icon.id ? 'border-cyan-400 bg-cyan-500/30 scale-105' : 'border-transparent hover:bg-white/10'}`}>
                                <div className="w-8 h-8 flex items-center justify-center bg-cyan-500 text-white rounded-full"><icon.component /></div>
                                <span className="text-xs mt-1 text-center">{icon.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderFacultyTab = () => (
        <div className="space-y-4">
            {(formData.faculty || []).map((member, index) => (
                <div key={member.id} className="p-3 bg-black/20 rounded-lg space-y-2 border border-gray-700">
                    <div className="flex justify-end"><button onClick={() => removeArrayItem('faculty', index)} className="text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button></div>
                    <input type="text" value={member.name} onChange={e => handleArrayItemChange('faculty', index, 'name', e.target.value)} placeholder="Name" className="w-full px-3 py-1 bg-black/30 rounded-md text-sm border-transparent focus:border-cyan-400 focus:ring-0"/>
                    <input type="text" value={member.title} onChange={e => handleArrayItemChange('faculty', index, 'title', e.target.value)} placeholder="Title" className="w-full px-3 py-1 bg-black/30 rounded-md text-sm border-transparent focus:border-cyan-400 focus:ring-0"/>
                    <input type="email" value={member.email} onChange={e => handleArrayItemChange('faculty', index, 'email', e.target.value)} placeholder="Email" className="w-full px-3 py-1 bg-black/30 rounded-md text-sm border-transparent focus:border-cyan-400 focus:ring-0"/>
                </div>
            ))}
            <button onClick={() => addArrayItem('faculty')} className="w-full py-2 text-sm font-semibold text-cyan-300 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20">Add Faculty Member</button>
        </div>
    );

     const renderNoticesTab = () => (
        <div className="space-y-4">
            {(formData.notices || []).map((notice, index) => (
                <div key={notice.id} className="p-3 bg-black/20 rounded-lg space-y-2 border border-gray-700">
                    <div className="flex justify-end"><button onClick={() => removeArrayItem('notices', index)} className="text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button></div>
                    <input type="text" value={notice.title} onChange={e => handleArrayItemChange('notices', index, 'title', e.target.value)} placeholder="Notice Title" className="w-full px-3 py-1 bg-black/30 rounded-md text-sm border-transparent focus:border-cyan-400 focus:ring-0"/>
                    <textarea value={notice.content} onChange={e => handleArrayItemChange('notices', index, 'content', e.target.value)} placeholder="Notice Content" rows={2} className="w-full px-3 py-1 bg-black/30 rounded-md text-sm border-transparent focus:border-cyan-400 focus:ring-0"/>
                </div>
            ))}
            <button onClick={() => addArrayItem('notices')} className="w-full py-2 text-sm font-semibold text-cyan-300 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20">Add Notice</button>
        </div>
    );

    const renderReviewsTab = () => (
        <div className="space-y-4">
             {(formData.reviews || []).map((review, index) => (
                <div key={review.id} className="p-3 bg-black/20 rounded-lg space-y-2 border border-gray-700">
                    <div className="flex justify-between items-center"><span className="text-xs text-gray-400">{review.date}</span><button onClick={() => removeArrayItem('reviews', index)} className="text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button></div>
                    <input type="text" value={review.author} onChange={e => handleArrayItemChange('reviews', index, 'author', e.target.value)} placeholder="Author Name" className="w-full px-3 py-1 bg-black/30 rounded-md text-sm border-transparent focus:border-cyan-400 focus:ring-0"/>
                    <textarea value={review.comment} onChange={e => handleArrayItemChange('reviews', index, 'comment', e.target.value)} placeholder="Review Comment" rows={2} className="w-full px-3 py-1 bg-black/30 rounded-md text-sm border-transparent focus:border-cyan-400 focus:ring-0"/>
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Rating:</label>
                        <input type="number" min="1" max="5" value={review.rating} onChange={e => handleArrayItemChange('reviews', index, 'rating', parseInt(e.target.value))} className="w-20 px-3 py-1 bg-black/30 rounded-md text-sm border-transparent focus:border-cyan-400 focus:ring-0"/>
                    </div>
                </div>
            ))}
            <button onClick={() => addArrayItem('reviews')} className="w-full py-2 text-sm font-semibold text-cyan-300 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20">Add Review</button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg p-8 mx-4 bg-black/50 backdrop-blur-2xl rounded-2xl shadow-2xl border border-cyan-500/30 text-gray-200 flex flex-col" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-[0_0_5px_rgba(0,200,255,0.5)]">
                    {isEditing ? 'Edit Location' : 'Add New Location'}
                </h3>

                {isEditing && (
                    <div className="border-b border-cyan-400/20 mb-4">
                        <nav className="-mb-px flex space-x-4">
                            <button onClick={() => setActiveTab('details')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'details' ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-gray-400 hover:text-white'}`}>Details</button>
                            <button onClick={() => setActiveTab('faculty')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'faculty' ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-gray-400 hover:text-white'}`}>Faculty</button>
                            <button onClick={() => setActiveTab('notices')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'notices' ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-gray-400 hover:text-white'}`}>Notices</button>
                            <button onClick={() => setActiveTab('reviews')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'reviews' ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-gray-400 hover:text-white'}`}>Reviews</button>
                        </nav>
                    </div>
                )}
                
                <div className="flex-grow overflow-y-auto max-h-[50vh] pr-2">
                    {!isEditing && renderDetailsTab()}
                    {isEditing && activeTab === 'details' && renderDetailsTab()}
                    {isEditing && activeTab === 'faculty' && renderFacultyTab()}
                    {isEditing && activeTab === 'notices' && renderNoticesTab()}
                    {isEditing && activeTab === 'reviews' && renderReviewsTab()}
                </div>
                
                <div className="flex-shrink-0 flex justify-between mt-8 space-x-4">
                    <button onClick={onClose} className="w-full px-4 py-3 font-semibold text-gray-200 uppercase bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaveDisabled} className="w-full px-4 py-3 font-semibold text-white uppercase bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none">
                        {isEditing ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddLocationModal;