import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        pannellum: any;
    }
}

interface PannellumViewerProps {
    imageSrc: string;
    onClose: () => void;
}

const PannellumViewer: React.FC<PannellumViewerProps> = ({ imageSrc, onClose }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const pannellumInstance = useRef<any>(null);

    useEffect(() => {
        if (viewerRef.current && window.pannellum) {
            pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
                type: 'equirectangular',
                panorama: imageSrc,
                autoLoad: true,
                showControls: true,
                compass: true,
                northOffset: 247.5,
            });
        }

        return () => {
            if (pannellumInstance.current) {
                pannellumInstance.current.destroy();
            }
        };
    }, [imageSrc]);
    
    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <div ref={viewerRef} className="w-full h-full"></div>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-3 bg-black/30 backdrop-blur-md text-white rounded-full hover:bg-black/50 transition-colors shadow-lg border border-white/20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default PannellumViewer;