import React, { useState } from 'react';
import type { Location, Review, User } from '../types';

interface ReviewModalProps {
    location: Location;
    onClose: () => void;
    onSave: (reviewData: { rating: number, comment: string }) => void;
    user: User;
}

const StarIcon: React.FC<{ filled: boolean, onHover: () => void, onClick: () => void }> = ({ filled, onHover, onClick }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-8 w-8 cursor-pointer transition-colors ${filled ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500'}`} 
        viewBox="0 0 20 20" 
        fill="currentColor"
        onMouseEnter={onHover}
        onClick={onClick}
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ReviewModal: React.FC<ReviewModalProps> = ({ location, onClose, onSave, user }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSave = () => {
        if (rating > 0 && comment.trim() && user) {
            onSave({ rating, comment });
        }
    };

    const isSaveDisabled = rating === 0 || !comment.trim() || !user;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg p-8 mx-4 bg-black/50 backdrop-blur-2xl rounded-2xl shadow-2xl border border-cyan-500/30 text-gray-200" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-center text-white mb-2 drop-shadow-[0_0_5px_rgba(0,200,255,0.5)]">Leave a Review</h3>
                <p className="text-center text-gray-300 mb-6">For <span className="font-semibold text-cyan-300">{location.name}</span></p>

                <div className="space-y-6">
                    <div>
                        <label className="block mb-2 font-medium text-center">Your Rating</label>
                        <div className="flex justify-center" onMouseLeave={() => setHoverRating(0)}>
                            {Array.from({ length: 5 }, (_, i) => (
                                <StarIcon
                                    key={i}
                                    filled={(hoverRating || rating) > i}
                                    onHover={() => setHoverRating(i + 1)}
                                    onClick={() => setRating(i + 1)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="review-comment" className="block mb-1 font-medium">Comment</label>
                        <textarea
                            id="review-comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            placeholder="Share your experience..."
                            className="w-full px-3 py-2 bg-black/30 rounded-lg border border-transparent text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-0"
                        />
                    </div>
                    <p className="text-sm text-center text-gray-400">
                        You are posting as: <span className="font-semibold text-white">{user?.name || '...'}</span>
                    </p>
                </div>

                <div className="flex justify-between mt-8 space-x-4">
                    <button onClick={onClose} className="w-full px-4 py-3 font-semibold text-gray-200 uppercase bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaveDisabled} className="w-full px-4 py-3 font-semibold text-white uppercase bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none">
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;