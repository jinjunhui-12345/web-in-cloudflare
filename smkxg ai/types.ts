
export interface Reservation {
  id: string;
  name: string;
  identity: string; // 新增: 身份
  phone: string;
  visitDate: string; // ISO date string (YYYY-MM-DD)
  visitTime: string; // 新增: 参观时间段 (例如 "09:00")
  remarks?: string;  // 新增: 备注
  submitTime: string; // ISO timestamp
  status: 'confirmed' | 'cancelled' | 'visited';
}

export type ReservationFormData = Omit<Reservation, 'id' | 'submitTime' | 'status'>;
