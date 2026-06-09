import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import type { ActivityLog, ActivityAction } from './types';

const logsCol = collection(db, 'activity_logs');

/**
 * 変更履歴を保存します
 * @param editorName 編集者の名前
 * @param action アクションの種類
 * @param targetName 操作の対象（例：処置名や器具名）
 */
export async function addLog(editorName: string, action: ActivityAction, targetName: string) {
  // 編集者が選択されていない場合は「不明な編集者」とする
  const nameToSave = editorName.trim() === '' ? '不明な編集者' : editorName;

  try {
    const log: ActivityLog = {
      editorName: nameToSave,
      action,
      targetName,
      timestamp: Date.now()
    };
    await addDoc(logsCol, log);
  } catch (error) {
    console.error("Failed to add activity log", error);
  }
}

/**
 * 最新の変更履歴を購読します
 * @param maxLogs 取得する最大件数
 * @param callback データ更新時に呼ばれるコールバック
 */
export function subscribeToLogs(maxLogs: number, callback: (logs: ActivityLog[]) => void) {
  const q = query(logsCol, orderBy('timestamp', 'desc'), limit(maxLogs));
  
  return onSnapshot(q, (snapshot) => {
    const logs: ActivityLog[] = [];
    snapshot.forEach((docSnap) => {
      logs.push({ id: docSnap.id, ...docSnap.data() } as ActivityLog);
    });
    callback(logs);
  });
}
