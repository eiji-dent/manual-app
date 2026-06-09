export type InstrumentMaster = {
  name: string;
  masterDescription?: string;
  imageUrl?: string;
};

export type PreparationItem = {
  name: string;
  description?: string; // 個別のメモ用（グレーの文字）
};

export type Procedure = {
  id: string;
  name: string;
  items: (string | PreparationItem)[]; // 移行期間のため string も許容
  conditionalItems?: { condition: string; items: (string | PreparationItem)[] }[];
  checkItems?: string[];
  notes?: string;
};

export type Doctor = {
  id: string;
  name: string;
  procedures: Procedure[];
};

export type ActivityAction = 'update_procedure' | 'update_master_image' | 'update_master_desc';

export type ActivityLog = {
  id?: string;
  editorName: string;
  action: ActivityAction;
  targetName: string; // ex: "宮澤先生 - EXT", "基本セット"
  timestamp: number;
};
