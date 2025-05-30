import { Ticket } from "../models/Ticket";

export interface Observer {
  update(ticket: Ticket): void;
}
