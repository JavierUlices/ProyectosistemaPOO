import { Handler } from "./Handler";
import { Ticket } from "../models/Ticket";
import { Priority } from "../enums/Priority";
import { SupportLevel } from "../enums/SupportLevel";

export class SeniorHandler extends Handler {
  handleRequest(ticket: Ticket): void {
    if (ticket.priority === Priority.Alto) {
      console.log(`Manejador de ticket nivel Senior (Nivel ${SupportLevel.SENIOR}) procesando el ticket ${ticket.ticketId}`);
      ticket.changeStatus("Resuelto");
    } else {
      console.log(`Ticket ${ticket.ticketId} escalado desde el nivel Senior`);
      this.nextHandler(ticket);
    }
  }

  handleTicket(ticket: Ticket): void {
    if (ticket.priority === Priority.Alto) {
      ticket.changeStatus('Resuelto', 'Técnico Senior', 'Senior');
    } else {
      this.escalateToNextLevel(ticket);
    }
  }
}

// Cambios