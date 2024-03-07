export interface Event {
  id: number;
  name: string;
  date: Date;
  open: Date;
  close: Date;
  created_at: Date;
  updated_at: Date;
  genre: string;
  organizer: string;
  price: string;
  allocation: string;
  tickets_sold: string;
  is_sold_out: string;
  line_up: string;
  description: string;
}
