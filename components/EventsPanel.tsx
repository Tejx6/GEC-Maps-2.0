import React from 'react';
import type { Event } from '../types';

interface EventsPanelProps {
    events: Event[];
}

const EventsPanel: React.FC<EventsPanelProps> = ({ events }) => {
    if (events.length === 0) {
        return null;
    }

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 z-10 p-3 sm:p-4 w-11/12 max-w-sm sm:w-72 bg-gray-900/80 backdrop-blur-md rounded-lg border border-white/10 shadow-lg text-white animate-fade-in-up">
            <h3 className="font-bold text-pink-300 flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Live Campus Events
            </h3>
            <ul className="space-y-2 text-sm">
                {events.map(event => (
                    <li key={event.id}>
                        <p className="font-semibold text-gray-100">{event.name}</p>
                        <p className="text-xs text-gray-400">{event.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventsPanel;