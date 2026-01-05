// Catalyst Local Core Service - 100% Local Persistence & Guest Auth (Zero Cloud Billing)

const STORAGE_KEYS = {
    USER: 'antigravity_user',
    PROGRESS: 'antigravity_progress',
    LESSONS: 'antigravity_lessons',
};

// --- Mock Auth ---
export interface MockUser {
    uid: string;
    displayName: string;
    email: string;
}

export const signInAsGuest = async (name: string): Promise<MockUser> => {
    const user = {
        uid: 'guest-' + Date.now(),
        displayName: name,
        email: 'guest@antigravity.edu'
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
};

export const getGuestUser = (): MockUser | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
};

export const signOut = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.reload();
};

export const auth = {
    currentUser: getGuestUser()
};

// --- Persistence ---

export const saveLessonCache = async (nodeId: string, content: any) => {
    try {
        const cache = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSONS) || '{}');
        cache[nodeId] = { content, updatedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(cache));
    } catch (e) {
        console.error("LS Error caching lesson:", e);
    }
};

export const getCachedLesson = async (nodeId: string) => {
    try {
        const cache = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSONS) || '{}');
        return cache[nodeId] ? cache[nodeId].content : null;
    } catch (e) {
        return null; // Fail gracefully
    }
};

export const updateUserProgress = async (_userId: string, nodeId: string, status: 'locked' | 'unlocked' | 'completed') => {
    try {
        const progress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}');
        progress[nodeId] = status;
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (e) {
        console.error("LS Error updating progress:", e);
    }
};

export const getUserProgress = async (_userId: string) => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}');
    } catch (e) {
        return {};
    }
};



