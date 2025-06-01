import { Handler } from "./Handler";
import { Ticket } from "../models/Ticket";
import { Priority } from "../enums/Priority";
import { SupportLevel } from "../enums/SupportLevel";

export class ManagerHandler extends Handler {
  private calculateResolutionTime(priority: Priority): number {
    switch (priority) {
      case Priority.Critico:
        return 240; // 4 horas
      case Priority.Alto:
        return 180; // 3 horas
      case Priority.Medio:
        return 120; // 2 horas
      case Priority.Bajo:
        return 60;  // 1 hora
      default:
        return 120;
    }
  }

  handleRequest(ticket: Ticket): void {
    if (ticket.priority === Priority.Critico) {
      console.log(`Manejador de ticket nivel Manager (Nivel ${SupportLevel.MANAGER}) procesando el ticket ${ticket.ticketId}`);
      ticket.changeStatus("Resuelto");
    } else {
      console.log(`El ticket ${ticket.ticketId} no puede ser manejado por el gerente`);
    }
  }

  handleTicket(ticket: Ticket): void {
    if (ticket.priority === Priority.Critico) {
      const resolutionTime = this.calculateResolutionTime(ticket.priority);
      const resolutionDate = new Date(ticket.createdAt.getTime() + resolutionTime * 60000);
      
      ticket.changeStatus(
        'Resuelto', 
        'Manager', 
        'Manager', 
        resolutionTime,
        resolutionDate
      );
      
      console.log(`Ticket resuelto por Manager en ${resolutionTime} minutos`);
      console.log(`Fecha de resolución: ${resolutionDate.toLocaleString()}`);
    } else {
      console.log('No se puede escalar más el ticket');
    }
  }
}

// Cambios