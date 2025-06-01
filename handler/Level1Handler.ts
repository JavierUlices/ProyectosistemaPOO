import { Handler } from "./Handler";
import { Ticket } from "../models/Ticket";
import { Priority } from "../enums/Priority";
import { SupportLevel } from "../enums/SupportLevel";

export class Level1Handler extends Handler {
  handleRequest(ticket: Ticket): void {
    if (ticket.priority === Priority.bajo) {
      console.log(`Manejador de ticket nivel 1 (Técnico - Nivel ${SupportLevel.TECNICO}) procesando el ticket ${ticket.ticketId}`);
      ticket.changeStatus("Resuelto");
    } else {
      console.log(`Ticket ${ticket.ticketId} escalado desde el nivel 1`);
      this.nextHandler(ticket);
    }
  }

  handleTicket(ticket: Ticket): void {
    if (ticket.priority === Priority.Bajo) {
        ticket.changeStatus('Resuelto', 'Técnico Level 1', 'Level 1');
    } else {
        this.escalateToNextLevel(ticket);
    }
}
}

// Cambios