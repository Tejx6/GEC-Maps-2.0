import type React from 'react';

export type ViewMode = 'classic' | 'futuristic';

export interface Coords {
    x: number;
    y: number;
}

export interface Review {
    id: string;
    author: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

export interface Faculty {
    id: string;
    name: string;
    department: string;
    email: string;
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
}

export interface Location {
    id: string;
    name: string;
    description: string;
    position: Coords;
    streetViewImage: string | null;
    iconId?: string;
    icon?: React.ReactElement;
    color?: string;
    faculty: Faculty[];
    notices: Notice[];
    reviews: Review[];
}

export interface Event {
    id: string;
    name: string;
    description: string;
    position: Coords;
}

export interface User {
    uid: string;
    name: string;
    email?: string;
    type: 'admin' | 'guest';
}
