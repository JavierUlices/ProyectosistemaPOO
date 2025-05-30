import { Handler } from "./Handler";
import { Ticket } from "../models/Ticket";
import { Priority } from "../enums/Priority";
import { SupportLevel } from "../enums/SupportLevel";

export class ManagerHandler extends Handler {
  handleRequest(ticket: Ticket): void {
    if (ticket.priority === Priority.Critico) {
      console.log(`Manejador de ticket nivel Manager (Nivel ${SupportLevel.MANAGER}) procesando el ticket ${ticket.ticketId}`);
      ticket.changeStatus("Resuelto");
    } else {
      console.log(`El ticket ${ticket.ticketId} no puede ser manejado por el gerente`);
    }
  }
}

// Cambios