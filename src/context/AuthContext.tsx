"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  browserLocalPersistence,
  onAuthStateChanged, 
  setPersistence,
  type Unsubscribe,
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut
} from "firebase/auth";
import { auth } from "@/firebase/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => {};
    let isActive = true;

    async function initializeAuthPersistence() {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error("Auth persistence error:", error);
      }

      unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        if (!isActive) {
          return;
        }

        setUser(nextUser);
        setLoading(false);
      });
    }

    void initializeAuthPersistence();

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  const refreshUser = async () => {
    if (!auth.currentUser) {
      setUser(null);
      return;
    }

    await auth.currentUser.reload();
    setUser(auth.currentUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
