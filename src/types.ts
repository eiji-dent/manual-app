export type Procedure = {
  id: string;
  name: string;
  items: string[];
  conditionalItems?: { condition: string; items: string[] }[];
  checkItems?: string[];
  notes?: string;
};

export type Doctor = {
  id: string;
  name: string;
  procedures: Procedure[];
};
