import React, { useState, useRef } from 'react';
import type { Location } from '../types';

interface UploadModalProps {
    location: Location;
    onClose: () => void;
    onSave: (locationId: string, imageUrl: string) => void;
}

// Icon for the drop zone
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75M4.5 12.75v-6a2.25 2.25 0 012.25-2.25h10.5a2.25 2.25 0 012.25 2.25v6m-16.5-6.75h16.5" />
    </svg>
);

const UploadModal: React.FC<UploadModalProps> = ({ location, onClose, onSave }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (selectedFile: File | undefined | null) => {
        if (!selectedFile) return;

        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
            setError('File size must be less than 5MB.');
            setFile(null);
            setPreview(null);
            return;
        }
        if (!selectedFile.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            setFile(null);
            setPreview(null);
            return;
        }

        setError('');
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        processFile(event.target.files?.[0]);
    };

    const handleSave = () => {
        if (preview && file) {
            onSave(location.id, preview);
        }
    };
    
    // Drag and Drop handlers
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Necessary to allow drop
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        processFile(e.dataTransfer.files?.[0]);
    };

    // Trigger file input click
    const onZoneClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg p-8 mx-4 bg-black/50 backdrop-blur-2xl rounded-2xl shadow-2xl border border-cyan-500/30" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-center text-white mb-2 drop-shadow-[0_0_5px_rgba(0,200,255,0.5)]">Upload 360° Image</h3>
                <p className="text-center text-gray-300 mb-6">For <span className="font-semibold text-cyan-300">{location.name}</span></p>

                <div
                    onClick={onZoneClick}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`cursor-pointer w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center mb-4 overflow-hidden transition-colors ${isDragging ? 'border-cyan-400 bg-cyan-500/20' : 'border-gray-600 hover:border-cyan-400/70'}`}
                >
                    <input ref={fileInputRef} id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    {preview ? (
                        <img src={preview} alt="Image preview" className="object-cover w-full h-full pointer-events-none" />
                    ) : (
                        <div className="text-center text-gray-400 pointer-events-none">
                             <UploadIcon className="w-12 h-12 mx-auto mb-2" />
                             <p className="font-semibold">Drag & drop or click to upload</p>
                             <p className="text-sm mt-1">PNG, JPG, etc. up to 5MB</p>
                        </div>
                    )}
                </div>

                {file && !error && <p className="text-gray-300 text-sm -mt-2 mb-2 text-center">Selected file: <span className="font-medium">{file.name}</span></p>}
                {error && <p className="text-red-500 text-sm -mt-2 mb-2 text-center">{error}</p>}

                <div className="flex justify-between mt-8 space-x-4">
                    <button onClick={onClose} className="w-full px-4 py-3 font-semibold text-gray-200 uppercase bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={!file || !!error} className="w-full px-4 py-3 font-semibold text-white uppercase bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-shadow disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;