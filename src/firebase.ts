import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { SpendProject } from './types';

// Replace these configuration values with your Firebase console project settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAXr0CZUAs-O5mKDgxQ2e8rrPaHIZj7gM0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "baaki-69486.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "baaki-69486",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "baaki-69486.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "317752372813",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:317752372813:web:dceef4f7d66e2712bb3604"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Subscribe to real-time updates for projects collection in Firestore.
 */
export const subscribeProjects = (onUpdate: (projects: SpendProject[]) => void) => {
  return onSnapshot(
    collection(db, 'projects'),
    (snapshot) => {
      const projectsList: SpendProject[] = [];
      snapshot.forEach((docSnap) => {
        projectsList.push(docSnap.data() as SpendProject);
      });
      // Sort projects by createdAt descending
      projectsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(projectsList);
    },
    (error) => {
      console.warn("Firestore subscription warning/error:", error);
    }
  );
};

/**
 * Save or update a project document in Firestore.
 */
export const saveProjectToFirestore = async (project: SpendProject) => {
  try {
    await setDoc(doc(db, 'projects', project.id), project);
  } catch (err) {
    console.error("Error writing project to Firestore:", err);
  }
};

/**
 * Delete a project document from Firestore.
 */
export const deleteProjectFromFirestore = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (err) {
    console.error("Error deleting project from Firestore:", err);
  }
};



// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAXr0CZUAs-O5mKDgxQ2e8rrPaHIZj7gM0",
//   authDomain: "baaki-69486.firebaseapp.com",
//   projectId: "baaki-69486",
//   storageBucket: "baaki-69486.firebasestorage.app",
//   messagingSenderId: "317752372813",
//   appId: "1:317752372813:web:dceef4f7d66e2712bb3604",
//   measurementId: "G-KVM9MNQXEJ"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);