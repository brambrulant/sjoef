export interface Event {
  date: Date | null;
  id: number;
  name: string | null;
  open: string | null;
  close: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  genre: string | null;
  organizer: string | null;
  price: string | null;
  allocation: number | null;
  tickets_sold: number | null;
  is_sold_out: string | null;
  line_up: string | null;
  description: string | null;
  external_link: string | null;
  external_ticketing: boolean | null;
}
