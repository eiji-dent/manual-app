export type PreparationItem = {
  name: string;
  description?: string;
  imageUrl?: string;
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
