import { Observer } from "../interface/Observer";
import { Ticket } from "../models/Ticket";

export class NotificationService implements Observer {
  update(ticket: Ticket): void {
    console.log(`Notificación: Ticket ${ticket.ticketId} estado cambiado ${ticket.status}`);
  }
}
