import React from 'react';
import type { Location } from '../../types';

interface CampusDepartmentsPanelProps {
    locations: Location[];
}

const CampusDepartmentsPanel: React.FC<CampusDepartmentsPanelProps> = ({ locations }) => {
    return (
        <div className="absolute bottom-4 left-4 z-10 p-4 w-64 bg-black/30 backdrop-blur-md rounded-lg border border-white/10 shadow-lg hidden sm:block">
            <h3 className="font-bold text-white mb-3">Campus Departments ({locations.length})</h3>
            <ul className="space-y-2 text-sm">
                {locations.slice(0, 4).map(loc => (
                    <li key={loc.id} className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: loc.color }}></span>
                        <span className="text-gray-300 truncate">{loc.name}</span>
                    </li>
                ))}
                {locations.length > 4 && (
                    <li className="text-gray-400 text-xs pt-1">+ {locations.length - 4} more</li>
                )}
            </ul>
        </div>
    );
};

export default CampusDepartmentsPanel;