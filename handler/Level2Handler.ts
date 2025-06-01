import { Handler } from "./Handler";
import { Ticket } from "../models/Ticket";
import { Priority } from "../enums/Priority";
import { SupportLevel } from "../enums/SupportLevel";

export class Level2Handler extends Handler {
  handleRequest(ticket: Ticket): void {
    if (ticket.priority === Priority.Medio) {
      console.log(`Manejador de ticket nivel 2 (Issues - Nivel ${SupportLevel.Issues}) procesando el ticket ${ticket.ticketId}`);
      ticket.changeStatus("Resuelto");
    } else {
      console.log(`Ticket ${ticket.ticketId} escalado desde el nivel 2`);
      this.nextHandler(ticket);
    }
  }

  handleTicket(ticket: Ticket): void {
    if (ticket.priority === Priority.Medio) {
        ticket.changeStatus('Resuelto', 'Técnico Level 2', 'Level 2');
    } else {
        this.escalateToNextLevel(ticket);
    }
}
} 
// Cambios