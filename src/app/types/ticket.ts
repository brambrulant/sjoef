export interface Ticket {
  id: string;
  event_id: number;
  user_id: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}
