export interface Stat {
  id: number;
  title: string;
  value: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  stockStatus: 'low' | 'ok';
}

export interface ActivityItem {
  id: number;
  message: string;
}

export interface BarData {
  name: string;
  stock: number;
}

export interface PieData {
  name: string;
  value: number;
}
