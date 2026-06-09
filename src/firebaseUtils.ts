import { collection, doc, setDoc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { mockDoctors } from './data/mockData';
import type { Doctor } from './types';

const doctorsCol = collection(db, 'doctors');

export async function initializeFirestoreData() {
  const snapshot = await getDocs(doctorsCol);
  if (snapshot.empty) {
    console.log("Initializing Firestore with mock data...");
    for (const docData of mockDoctors) {
      await setDoc(doc(doctorsCol, docData.id), docData);
    }
    console.log("Done initializing.");
  }
}

export function subscribeToDoctors(callback: (doctors: Doctor[]) => void) {
  return onSnapshot(doctorsCol, (snapshot) => {
    const docs = snapshot.docs.map(d => d.data() as Doctor);
    // ソート順を固定（宮澤、柴田、信濃、矢山の順など、idで大まかにソートするか名前でソート）
    docs.sort((a, b) => {
      const order = ['miyazawa', 'shibata', 'shinano', 'yayama'];
      const aIndex = order.indexOf(a.id);
      const bIndex = order.indexOf(b.id);
      return (aIndex !== -1 ? aIndex : 99) - (bIndex !== -1 ? bIndex : 99);
    });
    callback(docs);
  });
}

export async function updateDoctor(doctorId: string, updatedData: Partial<Doctor>) {
  await updateDoc(doc(doctorsCol, doctorId), updatedData);
}
