
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export type PublicLink = {
  id: string;
  name: string;
  url: string;
  desc: string;
};

export type PublicApi = {
  id: string;
  name: string;
  endpoint: string;
  status: '生效中' | '已禁用';
};

/*
 * =================================================================
 * 注意：这是您需要在Firestore中创建的数据的示例。
 * `public_links` 和 `public_apis` 是两个独立的集合。
 * =================================================================
const mockLinksForFirestore = [
  { name: 'ShadCN UI 文档', url: 'https://ui.shadcn.com', desc: '组件库文档。' },
  { name: 'Lucide 图标集', url: 'https://lucide.dev', desc: '项目所使用的图标库。' },
];

const mockApisForFirestore = [
  { name: 'Stripe API', endpoint: 'https://api.stripe.com', status: '生效中' },
  { name: 'Google Maps API', endpoint: 'https://maps.googleapis.com', status: '生效中' },
  { name: '内部用户数据API', endpoint: '/api/internal/users', status: '已禁用'},
];
*/

// --- Links ---
export async function getLinks(): Promise<PublicLink[]> {
    try {
        const snapshot = await getDocs(collection(db, 'public_links'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PublicLink));
    } catch (error) {
        console.error("Error fetching links from Firestore:", error);
        throw error;
    }
}

export async function addLink(linkData: Omit<PublicLink, 'id'>): Promise<PublicLink> {
    const docRef = await addDoc(collection(db, 'public_links'), linkData);
    return { id: docRef.id, ...linkData };
}

export async function deleteLink(linkId: string): Promise<void> {
    await deleteDoc(doc(db, 'public_links', linkId));
}

// --- APIs ---
export async function getApis(): Promise<PublicApi[]> {
    try {
        const snapshot = await getDocs(collection(db, 'public_apis'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PublicApi));
    } catch (error) {
        console.error("Error fetching APIs from Firestore:", error);
        throw error;
    }
}

export async function addApi(apiData: Omit<PublicApi, 'id'>): Promise<PublicApi> {
    const docRef = await addDoc(collection(db, 'public_apis'), apiData);
    return { id: docRef.id, ...apiData };
}

export async function deleteApi(apiId: string): Promise<void> {
    await deleteDoc(doc(db, 'public_apis', apiId));
}
