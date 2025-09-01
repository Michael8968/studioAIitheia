
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';

export type KnowledgeEntry = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  content: string;
  created: Timestamp;
};

export type KnowledgeEntryData = Omit<KnowledgeEntry, 'id' | 'created'>;


/*
 * =================================================================
 * 注意：这是您需要在Firestore的`knowledge_base`集合中创建的数据的示例。
 * =================================================================
const mockKnowledgeForFirestore = [
  { name: '3D打印材料指南', category: '制造', tags: ['PLA', 'ABS', '树脂'], content: '详细介绍各种3D打印材料的特性、用途和打印参数。', created: Timestamp.now() },
  { name: '标准供应链术语', category: '物流', tags: ['FOB', 'CIF', 'EXW'], content: '解释国际贸易中常用的供应链术语含义。', created: Timestamp.now() },
  { name: '设计师色彩理论', category: '设计原则', tags: ['类比', '互补'], content: '涵盖色彩搭配的基本原则、心理学和在设计中的应用。', created: Timestamp.now() },
];
*/


/**
 * Fetches all entries from the Firestore 'knowledge_base' collection.
 * @returns A promise that resolves to an array of all knowledge entries.
 */
export async function getKnowledgeEntries(): Promise<KnowledgeEntry[]> {
    try {
        const entriesCollection = collection(db, 'knowledge_base');
        const q = query(entriesCollection, orderBy('created', 'desc'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KnowledgeEntry));
        return list;
    } catch (error) {
        console.error("Error fetching knowledge entries from Firestore:", error);
        throw error;
    }
}

/**
 * Adds a new entry to the Firestore 'knowledge_base' collection.
 * @param entryData The data for the new entry.
 * @returns A promise that resolves to the newly created entry.
 */
export async function addKnowledgeEntry(entryData: KnowledgeEntryData): Promise<KnowledgeEntry> {
    try {
        const newDocData = {
            ...entryData,
            created: Timestamp.now(),
        };
        const docRef = await addDoc(collection(db, 'knowledge_base'), newDocData);
        return {
            id: docRef.id,
            ...newDocData,
        };
    } catch (error) {
        console.error("Error adding knowledge entry to Firestore:", error);
        throw error;
    }
}

/**
 * Deletes an entry from Firestore.
 * @param entryId The ID of the entry to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export async function deleteKnowledgeEntry(entryId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'knowledge_base', entryId));
    } catch (error) {
        console.error("Error deleting knowledge entry from Firestore:", error);
        throw error;
    }
}
