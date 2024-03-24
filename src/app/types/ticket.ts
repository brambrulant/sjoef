export interface Ticket {
  id: string;
  event_id: number;
  user_id: string;
  jwt: string;
  is_used: boolean;
  created_at: Date;
  updated_at: Date;
}
