/**
 * Client-side session context for demo auth
 */

"use client";

import type { DemoSession, DemoUser } from "@/lib/types";
import { findUserById } from "@/lib/auth/demo-storage";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

interface SessionContextType {
    session: DemoSession | null;
    user: DemoUser | null;
    isLoading: boolean;
    refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
    session: null,
    user: null,
    isLoading: true,
    refreshSession: async () => { },
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<DemoSession | null>(null);
    const [user, setUser] = useState<DemoUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        try {
            // Fetch session from server
            const response = await fetch("/api/auth/session");
            if (response.ok) {
                const sessionData = await response.json();
                setSession(sessionData);

                // Load user data from localStorage
                if (sessionData?.userId) {
                    const userData = findUserById(sessionData.userId);
                    setUser(userData);
                }
            } else {
                setSession(null);
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to refresh session:", error);
            setSession(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSession();
    }, [refreshSession]);

    return (
        <SessionContext.Provider
            value={{ session, user, isLoading, refreshSession }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within SessionProvider");
    }
    return context;
}

