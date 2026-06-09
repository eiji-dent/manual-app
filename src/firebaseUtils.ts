import { collection, doc, setDoc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from './firebase';
import { mockDoctors } from './data/mockData';
import type { Doctor, InstrumentMaster } from './types';

const doctorsCol = collection(db, 'doctors');
const instrumentsCol = collection(db, 'instruments');
export const storage = getStorage(db.app);

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export function subscribeToInstruments(callback: (data: Record<string, InstrumentMaster>) => void) {
  return onSnapshot(instrumentsCol, (snapshot) => {
    const map: Record<string, InstrumentMaster> = {};
    snapshot.docs.forEach(docSnap => {
      map[docSnap.id] = { name: docSnap.id, ...docSnap.data() } as InstrumentMaster;
    });
    callback(map);
  });
}

export async function updateInstrumentMaster(name: string, data: Partial<InstrumentMaster>) {
  // nameをドキュメントIDとして使用
  const safeId = name.replace(/\//g, '_'); // /が含まれるとパスエラーになるため安全化
  const docRef = doc(instrumentsCol, safeId);
  await setDoc(docRef, data, { merge: true });
}

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
