import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, MockUser, getGuestUser, signOut } from '../services/catalyst_core';

interface AuthContextType {
    user: MockUser | null;
    loading: boolean;
    loginGuest: (name: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginGuest: async () => { },
    logout: () => { }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<MockUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getGuestUser() || auth.currentUser;
        setUser(currentUser);
        setLoading(false);
    }, []);

    const loginGuest = async (name: string) => {
        const { signInAsGuest } = await import('../services/catalyst_core');
        const newUser = await signInAsGuest(name);
        setUser(newUser);
    };

    const logout = () => {
        signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginGuest, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
