// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCRH4EusKWPxH9YVbYRr3N6AMvcNd98RI",
  authDomain: "design-sales-d95bb.firebaseapp.com",
  projectId: "design-sales-d95bb",
  storageBucket: "design-sales-d95bb.appspot.com",
  messagingSenderId: "711093196627",
  appId: "1:711093196627:web:69d4aeacbd23720b07f3a6",
  measurementId: "G-275V79NTNJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// 添加连接状态跟踪
let isFirestoreConnected = false;
let connectionError: Error | null = null;

// 测试Firestore连接
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // 尝试一个简单的查询来测试连接
    const { collection, getDocs, limit, query } = await import('firebase/firestore');
    const testCollection = collection(db, '_test_connection');
    const q = query(testCollection, limit(1));
    await getDocs(q);
    isFirestoreConnected = true;
    connectionError = null;
    return true;
  } catch (error) {
    console.warn('Firestore连接失败，将使用模拟数据:', error);
    isFirestoreConnected = false;
    connectionError = error as Error;
    return false;
  }
}

// 获取连接状态
export function getFirestoreConnectionStatus(): { connected: boolean; error: Error | null } {
  return { connected: isFirestoreConnected, error: connectionError };
}

export { app, db, auth, isFirestoreConnected };
