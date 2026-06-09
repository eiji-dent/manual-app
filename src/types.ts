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
