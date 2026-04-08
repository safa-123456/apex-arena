import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, Timestamp, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

let toastCallback: ((message: string, type: "error" | "success") => void) | null = null;

export const setToastCallback = (callback: (message: string, type: "error" | "success") => void) => {
  toastCallback = callback;
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

function showAuthError(error: any) {
  const code = String(error?.code || "unknown");
  const map: Record<string, string> = {
    "auth/unauthorized-domain": "Login is blocked for this domain. Add localhost and 127.0.0.1 to Firebase Auth Authorized Domains.",
    "auth/operation-not-allowed": "Google sign-in is disabled in Firebase Auth. Enable Google provider in Authentication > Sign-in method.",
    "auth/invalid-api-key": "Firebase API key is invalid. Check firebase-applet-config.json.",
    "auth/network-request-failed": "Network error during login. Check internet connection and try again.",
  };
  const message = map[code] || `Login failed (${code}). Please check browser console for details.`;
  console.error("Sign-in error:", error);
  if (toastCallback) {
    toastCallback(message, "error");
  } else if (typeof window !== "undefined") {
    window.alert(message);
  }
}

// Auth Helpers
let isSigningIn = false;
export const signInWithGoogle = async () => {
  if (isSigningIn) return;
  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/cancelled-popup-request') {
      console.warn('Sign-in popup already open.');
      return; // Don't throw
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.log('User closed the sign-in popup.');
      return; // Don't throw
    } else if (error.code === 'auth/popup-blocked' || error.code === 'auth/operation-not-supported-in-this-environment') {
      console.warn('Popup sign-in unavailable, switching to redirect sign-in.', error);
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectError: any) {
        showAuthError(redirectError);
      }
      return;
    } else {
      showAuthError(error);
      return; // Keep UI alive for all auth failures
    }
  } finally {
    isSigningIn = false;
  }
};
export const logout = () => signOut(auth);

// Firestore Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();
