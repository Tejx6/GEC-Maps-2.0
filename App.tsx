
import React, { useState, useEffect, useRef } from 'react';
import ClassicApp from './ClassicApp';
import FuturisticApp from './FuturisticApp';
import AuthModal from './components/AuthModal';
import AdminSettingsModal from './components/AdminSettingsModal';
import type { ViewMode, Location, Event, User, Review, Faculty, Notice } from './types';
import { getIconComponent, FUTURISTIC_COLOR_PALETTE } from './constants';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';

const App: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('classic');
    const [locations, setLocations] = useState<Location[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isAdminSettingsModalOpen, setAdminSettingsModalOpen] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    
    const subcollectionUnsubscribes = useRef<Unsubscribe[]>([]);

    useEffect(() => {
        setDataLoading(true);
        
        const locationsCol = collection(db, 'locations');
        const eventsCol = collection(db, 'events');

        const unsubscribeLocations = onSnapshot(locationsCol, (snapshot) => {
            const fetchedLocations: Location[] = snapshot.docs.map(d => ({
                ...(d.data() as Omit<Location, 'id'>),
                id: d.id,
                faculty: [],
                notices: [],
                reviews: []
            }));
            setLocations(fetchedLocations);
            if (dataLoading) setDataLoading(false);
        }, (error) => {
            console.error("Error with location snapshot:", error);
            const storedLocations = localStorage.getItem('gec_campus_locations');
            setLocations(storedLocations ? JSON.parse(storedLocations) : []);
            setDataLoading(false);
        });

        const unsubscribeEvents = onSnapshot(eventsCol, (snapshot) => {
            const fetchedEvents: Event[] = snapshot.docs.map(d => ({ ...(d.data() as Omit<Event, 'id'>), id: d.id } as Event));
            setEvents(fetchedEvents);
        }, (error) => {
            console.error("Error with event snapshot:", error);
            const storedEvents = localStorage.getItem('gec_campus_events');
            setEvents(storedEvents ? JSON.parse(storedEvents) : []);
        });

        return () => {
            unsubscribeLocations();
            unsubscribeEvents();
            subcollectionUnsubscribes.current.forEach(unsub => unsub());
        };
    }, []);

    useEffect(() => {
        // Clean up previous listeners
        subcollectionUnsubscribes.current.forEach(unsub => unsub());
        subcollectionUnsubscribes.current = [];

        if (locations.length === 0) return;

        const newUnsubscribes: Unsubscribe[] = [];

        locations.forEach(location => {
            const facultyCol = collection(db, `locations/${location.id}/faculty`);
            const noticesCol = collection(db, `locations/${location.id}/notices`);
            const reviewsCol = collection(db, `locations/${location.id}/reviews`);

            const unsubFaculty = onSnapshot(facultyCol, (snap) => {
                const faculty = snap.docs.map(d => ({...d.data(), id: d.id} as Faculty));
                setLocations(prev => prev.map(loc => loc.id === location.id ? { ...loc, faculty } : loc));
            });
            newUnsubscribes.push(unsubFaculty);

            const unsubNotices = onSnapshot(noticesCol, (snap) => {
                const notices = snap.docs.map(d => ({...d.data(), id: d.id} as Notice));
                setLocations(prev => prev.map(loc => loc.id === location.id ? { ...loc, notices } : loc));
            });
            newUnsubscribes.push(unsubNotices);

            const unsubReviews = onSnapshot(reviewsCol, (snap) => {
                const reviews = snap.docs.map(d => ({...d.data(), id: d.id} as Review));
                setLocations(prev => prev.map(loc => loc.id === location.id ? { ...loc, reviews } : loc));
            });
            newUnsubscribes.push(unsubReviews);
        });

        subcollectionUnsubscribes.current = newUnsubscribes;

    }, [locations.map(l => l.id).join(',')]);


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'futuristic') {
            setViewMode('futuristic');
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Admin',
                    email: firebaseUser.email || '',
                    type: 'admin',
                });
            } else {
                setUser(null);
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSignInGuest = () => {
        setUser({ uid: 'local-guest', type: 'guest', name: 'Guest User' });
        setAuthModalOpen(false);
    };

    const handleSignUpAdmin = async (email: string, password: string, name: string): Promise<boolean> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            setUser({ uid: userCredential.user.uid, name: name, email: email, type: 'admin' });
            return true;
        } catch (error) {
            console.error("Firebase SignUp Error:", error);
            alert(`Registration failed. ${error.message}`);
            return false;
        }
    };

    const handleLoginAdmin = async (email: string, password: string): Promise<boolean> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error("Firebase Login Error:", error);
            alert(`Login failed. ${error.message}`);
            return false;
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Firebase SignOut Error:", error);
            alert(`Sign out failed. ${error.message}`);
        }
    };

    const handleUpdateAdmin = async (data: { name: string; newPassword?: string; currentPassword: string }): Promise<{ success: boolean; message: string }> => {
        // This functionality needs to be re-evaluated for Firebase Auth
        return { success: false, message: "Update via this panel is currently disabled." };
    };

    const handleUpdateLocation = async (updatedLocation: Location) => {
        const { faculty, notices, reviews, ...locationData } = updatedLocation;
        try {
            const locRef = doc(db, "locations", locationData.id);
            await setDoc(locRef, locationData, { merge: true });
        } catch (error) {
            console.error("Error updating location in Firestore:", error);
            alert('Failed to update location. Check Firestore rules and console for errors.');
        }
    };

    const handleAddLocation = async (newLocationData: Partial<Location>, coords: { x: number, y: number }) => {
        if (user?.type !== 'admin') return alert("You must be an admin to add a location.");
        const newLocation: Omit<Location, 'id'> = {
            name: newLocationData.name || 'New Location',
            description: newLocationData.description || '',
            position: coords,
            streetViewImage: null,
            iconId: newLocationData.iconId,
            color: FUTURISTIC_COLOR_PALETTE[locations.length % FUTURISTIC_COLOR_PALETTE.length],
            faculty: [],
            notices: [],
            reviews: []
        };
        try {
            const newDocRef = doc(collection(db, "locations"));
            await setDoc(newDocRef, newLocation);
        } catch (error) {
            console.error("Error adding location to Firestore:", error);
            alert('Failed to add location. Check Firestore rules and console for errors.');
        }
    };

    const handleDeleteLocation = async (locationId: string) => {
        if (user?.type !== 'admin') return alert("You must be an admin to delete a location.");
        try {
            await deleteDoc(doc(db, "locations", locationId));
        } catch (error) {
            console.error("Error deleting location from Firestore:", error);
            alert('Failed to delete location. Check Firestore rules and console for errors.');
        }
    };

    const handleAddEvent = async (newEventData: { name: string; description: string; }, coords: { x: number, y: number }) => {
        if (user?.type !== 'admin') return alert("You must be an admin to add an event.");
        const newEvent: Omit<Event, 'id'> = { ...newEventData, position: coords };
        try {
            await setDoc(doc(collection(db, "events")), newEvent);
        } catch (error) {
            console.error("Error adding event to Firestore:", error);
            alert('Failed to add event. Check Firestore rules and console for errors.');
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (user?.type !== 'admin') return alert("You must be an admin to delete an event.");
        try {
            await deleteDoc(doc(db, "events", eventId));
        } catch (error) {
            console.error("Error deleting event from Firestore:", error);
            alert('Failed to delete event. Check Firestore rules and console for errors.');
        }
    };

    const handleAddReview = async (locationId: string, reviewData: { rating: number; comment: string; }) => {
        if (!user) return alert("You must be logged in to add a review.");
        const newReview: Omit<Review, 'id'> = { ...reviewData, author: user.name || "Anonymous", date: new Date().toISOString().split('T')[0] };
        await setDoc(doc(collection(db, `locations/${locationId}/reviews`)), newReview);
    };
    
    const handleDeleteReview = async (locationId: string, reviewId: string) => {
        if (user?.type !== 'admin') return alert("You must be an admin to delete reviews.");
        await deleteDoc(doc(db, `locations/${locationId}/reviews`, reviewId));
    };
    
    const handleAddFaculty = async (locationId: string, facultyData: { name: string; department: string; email: string }) => {
        if (user?.type !== 'admin') return alert("You must be an admin to add faculty.");
        await setDoc(doc(collection(db, `locations/${locationId}/faculty`)), facultyData);
    };
    
    const handleDeleteFaculty = async (locationId: string, facultyId: string) => {
        if (user?.type !== 'admin') return alert("You must be an admin to delete faculty.");
        await deleteDoc(doc(db, `locations/${locationId}/faculty`, facultyId));
    };
    
    const handleAddNotice = async (locationId: string, noticeData: { title: string; content: string }) => {
        if (user?.type !== 'admin') return alert("You must be an admin to add notices.");
        const newNotice: Omit<Notice, 'id'> = { ...noticeData, date: new Date().toISOString().split('T')[0], author: user.name || "Admin" };
        await setDoc(doc(collection(db, `locations/${locationId}/notices`)), newNotice);
    };
    
    const handleDeleteNotice = async (locationId: string, noticeId: string) => {
        if (user?.type !== 'admin') return alert("You must be an admin to delete notices.");
        await deleteDoc(doc(db, `locations/${locationId}/notices`, noticeId));
    };

    useEffect(() => {
        document.documentElement.classList.remove('view-classic', 'view-futuristic');
        document.documentElement.classList.add(`view-${viewMode}`);
    }, [viewMode]);

    const toggleViewMode = () => setViewMode(prev => (prev === 'classic' ? 'futuristic' : 'classic'));

    const locationsWithIcons = locations.map(loc => ({
        ...loc,
        icon: loc.iconId ? React.createElement(getIconComponent(loc.iconId)) : undefined,
    }));

    const dataProps = {
        locations: locationsWithIcons,
        events,
        user,
        onUpdateLocation: handleUpdateLocation,
        onAddLocation: handleAddLocation,
        onDeleteLocation: handleDeleteLocation,
        onAddEvent: handleAddEvent,
        onDeleteEvent: handleDeleteEvent,
        onAddReview: handleAddReview,
        onDeleteReview: handleDeleteReview,
        onAddFaculty: handleAddFaculty,
        onDeleteFaculty: handleDeleteFaculty,
        onAddNotice: handleAddNotice,
        onDeleteNotice: handleDeleteNotice,
        onOpenAuthModal: () => setAuthModalOpen(true),
        onSignOut: handleSignOut,
        onOpenAdminSettingsModal: () => setAdminSettingsModalOpen(true),
    };

    return (
        <>
            {viewMode === 'futuristic' ? (
                <FuturisticApp 
                    onToggleViewMode={toggleViewMode} 
                    {...dataProps}
                />
            ) : (
                <ClassicApp 
                    onToggleViewMode={toggleViewMode} 
                    {...dataProps}
                />
            )}
            {isAuthModalOpen && (
                <AuthModal
                    onClose={() => setAuthModalOpen(false)}
                    onSignInGuest={handleSignInGuest}
                    onLoginAdmin={handleLoginAdmin}
                    onSignUpAdmin={handleSignUpAdmin}
                />
            )}
            {isAdminSettingsModalOpen && user?.type === 'admin' && (
                <AdminSettingsModal
                    user={user}
                    onClose={() => setAdminSettingsModalOpen(false)}
                    onSave={handleUpdateAdmin}
                />
            )}
        </>
    );
};

export default App;
