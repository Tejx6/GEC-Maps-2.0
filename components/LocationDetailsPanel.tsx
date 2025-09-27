
import React, { useState, useEffect } from 'react';
import type { Location, Review, User, Faculty, Notice } from '../types';

interface LocationDetailsPanelProps {
    location: Location | null;
    user: User | null;
    onClearSelection: () => void;
    onStreetViewClick: () => void;
    onUploadClick: () => void;
    onEditClick: () => void;
    onAddReviewClick: () => void;
    onAddFacultyClick: () => void; 
    onAddNoticeClick: () => void;
    onDeleteReview: (reviewId: string) => void;
    onDeleteFaculty: (facultyId: string) => void;
    onDeleteNotice: (noticeId: string) => void;
}

type Tab = 'details' | 'faculty' | 'notices' | 'reviews';

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const LocationDetailsPanel: React.FC<LocationDetailsPanelProps> = ({ 
    location, user, onClearSelection, onStreetViewClick, onUploadClick, onEditClick, 
    onAddReviewClick, onAddFacultyClick, onAddNoticeClick, 
    onDeleteReview, onDeleteFaculty, onDeleteNotice
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('details');

    useEffect(() => {
        if (location) {
            setActiveTab('details');
        }
    }, [location]);

    if (!location) return null;

    const averageRating = location.reviews?.length > 0 ? location.reviews.reduce((acc, review) => acc + review.rating, 0) / location.reviews.length : 0;
    const renderStars = (rating: number) => Array(5).fill(0).map((_, i) => <StarIcon key={i} filled={i < Math.round(rating)} />);

    const renderContent = () => {
        const isAdmin = user?.type === 'admin';

        switch (activeTab) {
            case 'details':
                return <p className="text-gray-400 text-sm p-5">{location.description || "No description available."}</p>;
            
            case 'faculty':
                return (
                    <div className="space-y-4 p-5">
                        {location.faculty?.length > 0 ? (
                            location.faculty.map(f => (
                                <div key={f.id} className="bg-gray-800/50 p-3 rounded-lg relative">
                                    <p className="font-semibold text-cyan-300">{f.name}</p>
                                    <p className="text-gray-400 text-sm">{f.department}</p>
                                    <p className="text-gray-500 text-xs mt-1">{f.email}</p>
                                    {isAdmin && <button onClick={() => onDeleteFaculty(f.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-xl">&times;</button>}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm text-center py-4">No faculty information available.</p>
                        )}
                        {isAdmin && <button onClick={onAddFacultyClick} className="w-full mt-2 py-2 text-sm font-semibold text-center bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/40 transition-colors">Add Faculty</button>}
                    </div>
                );

            case 'notices':
                return (
                    <div className="space-y-4 p-5">
                        {location.notices?.length > 0 ? (
                            location.notices.map(n => (
                                <div key={n.id} className="bg-gray-800/50 p-3 rounded-lg relative">
                                    <p className="font-semibold text-yellow-300">{n.title}</p>
                                    <p className="text-gray-400 text-sm mt-1">{n.content}</p>
                                    <p className="text-gray-500 text-xs mt-2">{n.date} by {n.author}</p>
                                    {isAdmin && <button onClick={() => onDeleteNotice(n.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-xl">&times;</button>}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm text-center py-4">No notices for this location.</p>
                        )}
                        {isAdmin && <button onClick={onAddNoticeClick} className="w-full mt-2 py-2 text-sm font-semibold text-center bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/40 transition-colors">Add Notice</button>}
                    </div>
                );

            case 'reviews':
                return (
                    <div className="space-y-4 p-5">
                        {location.reviews?.length > 0 ? (
                            location.reviews.map(review => (
                                <div key={review.id} className="bg-gray-800/50 p-3 rounded-lg relative">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-300">{review.author}</p>
                                        <div className="flex">{renderStars(review.rating)}</div>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">{review.comment}</p>
                                    <p className="text-gray-500 text-xs mt-2">{review.date}</p>
                                    {isAdmin && <button onClick={() => onDeleteReview(review.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-xl">&times;</button>}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm text-center py-4">No reviews yet.</p>
                        )}
                        <button onClick={onAddReviewClick} className="w-full mt-2 py-2 text-sm font-semibold text-center bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/40 transition-colors">Add Your Review</button>
                    </div>
                );
            default: return null;
        }
    };
    
    const TabButton: React.FC<{tab: Tab, label: string, count?: number}> = ({ tab, label, count }) => (
        <button 
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center px-3 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? 'text-cyan-300 border-cyan-400' : 'text-gray-400 border-transparent hover:text-white'}`}>
            {label}
            {count !== undefined && <span className="ml-2 bg-gray-700/50 text-xs font-bold rounded-full px-2 py-0.5">{count}</span>}
        </button>
    );

    return (
        <div className={`absolute top-0 right-0 h-full w-96 bg-gray-900/80 backdrop-blur-md shadow-2xl text-white transform transition-transform duration-300 ease-in-out flex flex-col ${location ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-5 border-b border-gray-700/50 flex-shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{location.name}</h2>
                        <div className="flex items-center mt-1">
                            {renderStars(averageRating)}
                            <span className="text-gray-400 text-sm ml-2">({location.reviews?.length || 0} reviews)</span>
                        </div>
                    </div>
                    <button onClick={onClearSelection} className="text-gray-500 hover:text-white transition-colors text-3xl leading-none">&times;</button>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                <div className="border-b border-gray-700/50 flex sticky top-0 bg-gray-900/80 backdrop-blur-md z-10">
                    <TabButton tab="details" label="Details" />
                    <TabButton tab="faculty" label="Faculty" count={location.faculty?.length || 0} />
                    <TabButton tab="notices" label="Notices" count={location.notices?.length || 0} />
                    <TabButton tab="reviews" label="Reviews" count={location.reviews?.length || 0} />
                </div>
                
                {renderContent()}
            </div>

            <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
                <div className="flex flex-col space-y-2">
                    {location.streetViewImage && (
                        <button onClick={onStreetViewClick} className="w-full py-2 px-4 bg-cyan-500/20 text-cyan-300 rounded-md text-sm font-semibold hover:bg-cyan-500/40 transition-colors">
                            Street View
                        </button>
                    )}
                    {user?.type === 'admin' && (
                        <div className="flex space-x-2">
                            <button onClick={onUploadClick} className="flex-1 py-2 px-4 bg-purple-500/20 text-purple-300 rounded-md text-sm font-semibold hover:bg-purple-500/40 transition-colors">
                                Upload 360
                            </button>
                            <button onClick={onEditClick} className="flex-1 py-2 px-4 bg-yellow-500/20 text-yellow-300 rounded-md text-sm font-semibold hover:bg-yellow-500/40 transition-colors">
                                Edit Details
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationDetailsPanel;
