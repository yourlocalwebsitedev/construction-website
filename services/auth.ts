// ============================================================
// Admin authentication.
//
// Uses Firebase Authentication (email/password) instead of a hardcoded
// frontend password. There is no public sign-up flow — an admin account
// must be created once by the business owner/developer in the Firebase
// Console (Authentication → Users → Add user), or via the Firebase CLI.
// No credentials are stored in source code.
// ============================================================
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase.config';

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function adminSignIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function adminSignOut(): Promise<void> {
  await signOut(auth);
}

export function getCurrentAdminUser(): User | null {
  return auth.currentUser;
}
