import React from 'react';
import type { Location, Event } from './types';

// Icons for different departments
const iconProps = {
    className: "w-5 h-5",
};

// Fix: Replaced JSX with React.createElement to make it compatible with a .ts file.
// The original JSX syntax was causing parsing errors because this is not a .tsx file.
export const MainBuildingIcon = () => React.createElement('svg', { ...iconProps, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" }));
export const ComputerIcon = () => React.createElement('svg', { ...iconProps, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" }));
export const MechanicalIcon = () => React.createElement('svg', { ...iconProps, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.343 3.94c.09-.542.56-1.007 1.11-1.226l.554-.221a2.25 2.25 0 012.387 2.387l-.221.554c-.219.55-.684 1.02-1.226 1.11a21.042 21.042 0 00-4.136 4.136c-.09.542-.56 1.007-1.11 1.226l-.554.221a2.25 2.25 0 01-2.387-2.387l.221-.554c.219-.55.684-1.02 1.226-1.11a21.042 21.042 0 004.136-4.136zM10.343 3.94L9 4.5l-1.06-1.061 1.06-1.061L10.343 3.94zm-4.136 7.893L9 12.5l-1.06-1.061 1.06-1.061-1.414-1.414L6.22 9.322a21.03 21.03 0 01-3.212 3.212c-.219.55-.684 1.02-1.226 1.11l-.554.221a2.25 2.25 0 002.387 2.387l.554-.221c.55-.219 1.02-.684 1.11-1.226a21.03 21.03 0 003.212-3.212zM12.828 12.828L14.25 11.414l1.06 1.06-1.06 1.06 1.414 1.414L18.78 13.78a21.03 21.03 0 013.212-3.212c.55.219 1.02.684 1.226 1.11l.221.554a2.25 2.25 0 01-2.387 2.387l-.554-.221c-.55-.219-1.02-.684-1.11-1.226a21.03 21.03 0 00-3.212-3.212z" }));
export const EtcIcon = () => React.createElement('svg', { ...iconProps, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" }));
export const LibraryIcon = () => React.createElement('svg', { ...iconProps, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" }));
export const CanteenIcon = () => React.createElement('svg', { ...iconProps, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 12.352c-.421-.336-1.01-.52-1.6-.52-1.215 0-2.31.62-2.983 1.594C16.48 14.366 15.295 15 14.007 15s-2.473-.634-3.16-1.574c-.673-.974-1.768-1.594-2.983-1.594s-2.31.62-2.983 1.594c-.687.94-1.872 1.574-3.16 1.574-1.215 0-2.31-.62-2.983-1.594C1.527 13.23 0 14.35 0 15.75c0 1.519 1.527 2.638 3.017 3.322.421.336 1.01.52 1.6.52 1.215 0 2.31-.62 2.983-1.594C8.287 17.058 9.472 16.422 10.76 16.422s2.473.636 3.16 1.574c.673.974 1.768 1.594 2.983 1.594s2.31-.62 2.983-1.594c.687-.938 1.872-1.574 3.16-1.574.59 0 1.179.184 1.6.52 1.49 1.184 3.017 1.303 3.017-.197v-1.5c0-1.4-1.527-2.52-3.017-3.204z" }));


export const FUTURISTIC_COLOR_PALETTE = [
    '#38bdf8', // sky-400
    '#fb923c', // orange-400
    '#ec4899', // pink-500
    '#818cf8', // indigo-400
    '#4ade80', // green-400
    '#facc15', // yellow-400
    '#a78bfa', // violet-400
];

export const INITIAL_LOCATIONS: Location[] = [
    {
        id: 'comp_dept',
        name: 'Computer Engineering Dept.',
        description: 'Home to the Computer and IT Engineering departments, labs, and faculty offices.',
        position: { x: 40, y: 45 },
        streetViewImage: null,
        iconId: 'computer',
        color: '#38bdf8',
        faculty: [
            { id: 'f1', name: 'Dr. Ankit Patel', title: 'Head of Department', email: 'ankit.patel@gec.ac.in' },
            { id: 'f2', name: 'Prof. Priya Sharma', title: 'Associate Professor', email: 'priya.sharma@gec.ac.in' },
        ],
        notices: [
            { id: 'n1', title: 'Workshop on AI', content: 'A hands-on workshop on Artificial Intelligence will be held on the 25th.', date: '2024-07-25' },
        ],
        reviews: [
            { id: 'r1', author: 'Rohan', rating: 5, comment: 'Excellent faculty and labs!', date: '2024-07-10' },
        ]
    },
    {
        id: 'mech_dept',
        name: 'Mechanical Engineering Dept.',
        description: 'Contains workshops, labs, and classrooms for Mechanical Engineering.',
        position: { x: 55, y: 65 },
        streetViewImage: null,
        iconId: 'mechanical',
        color: '#fb923c',
        faculty: [],
        notices: [],
        reviews: []
    },
];

export const INITIAL_EVENTS: Event[] = [
    {
        id: 'event1',
        name: 'Tech Fest "Tantra"',
        description: 'Annual technical festival with various competitions and workshops.',
        position: { x: 50, y: 50 }
    },
    {
        id: 'event2',
        name: 'Guest Lecture on Robotics',
        description: 'A special lecture by an industry expert in the main auditorium.',
        position: { x: 30, y: 60 }
    }
];

export const ICONS = [
    { id: 'main', name: 'Main Building', component: MainBuildingIcon },
    { id: 'computer', name: 'Computer/IT', component: ComputerIcon },
    { id: 'mechanical', name: 'Mechanical', component: MechanicalIcon },
    { id: 'etc', name: 'ETC', component: EtcIcon },
    { id: 'library', name: 'Library', component: LibraryIcon },
    { id: 'canteen', name: 'Canteen', component: CanteenIcon },
];

const iconMap: { [key: string]: React.FC } = {
    main: MainBuildingIcon,
    computer: ComputerIcon,
    mechanical: MechanicalIcon,
    etc: EtcIcon,
    library: LibraryIcon,
    canteen: CanteenIcon,
};

export const getIconComponent = (iconId: string): React.FC | null => {
    return iconMap[iconId] || null;
}