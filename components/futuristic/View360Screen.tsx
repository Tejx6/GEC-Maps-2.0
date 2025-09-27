import React from 'react';
import type { Location } from '../../types';

interface View360ScreenProps {
    locations: Location[];
    onView: (location: Location) => void;
}

const View360Screen: React.FC<View360ScreenProps> = ({ locations, onView }) => {
    const locationsWithImages = locations.filter(loc => loc.streetViewImage);

    return (
        <div className="absolute inset-0 pt-32 lg:pt-24 z-10 p-2 sm:p-6 flex flex-col animate-fade-in-up">
            <div className="flex-shrink-0 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.364 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white">360° Campus Tour</h2>
                        <p className="text-xs sm:text-sm text-gray-400">Explore panoramic views of the campus departments</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2">
                {locationsWithImages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {locationsWithImages.map(location => (
                           <div
                                key={location.id}
                                onClick={() => onView(location)}
                                className="bg-black/20 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden cursor-pointer group hover:border-cyan-400/50 transition-all duration-300 flex flex-col shadow-lg hover:shadow-cyan-500/20"
                            >
                                {/* Image container */}
                                <div className="relative aspect-video overflow-hidden">
                                    <img src={location.streetViewImage!} alt={location.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Info container */}
                                <div className="p-4 flex-grow flex flex-col justify-between bg-gray-900/60">
                                    <div>
                                        <h3 className="font-bold text-white text-lg truncate" title={location.name}>{location.name}</h3>
                                        <p className="text-sm text-gray-400 mt-1 h-10 overflow-hidden text-ellipsis">
                                            {location.description || 'No description available.'}
                                        </p>
                                    </div>
                                    <div className="mt-4 text-center text-sm font-medium text-cyan-300 group-hover:text-white transition-colors">
                                        Click to explore 360° view
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <h3 className="text-xl font-semibold text-gray-300">No 360° Views Available Yet</h3>
                        <p className="mt-2">Admins can upload images in the "Upload 360°" section.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default View360Screen;