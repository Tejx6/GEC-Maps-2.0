import React, { useState, useEffect } from 'react';

const TopRightStatus: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="absolute top-36 sm:top-6 right-2 sm:right-6 z-10 flex items-center gap-4 text-white font-medium">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
                <span className="text-sm bg-gradient-to-r from-pink-400 to-red-400 text-transparent bg-clip-text font-bold">Live</span>
            </div>
            <div className="text-sm text-gray-300">
                {formattedTime}
            </div>
        </div>
    );
};

export default TopRightStatus;