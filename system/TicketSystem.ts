import { Ticket } from "../models/Ticket";
import { NotificationService } from "../services/NotificationService";
import { Handler } from "../handler/Handler";
import { Level1Handler } from "../handler/Level1Handler";
import { Level2Handler } from "../handler/Level2Handler";
import { SeniorHandler } from "../handler/SeniorHandler";
import { ManagerHandler } from "../handler/ManagerHandler";
import { Priority } from "../enums/Priority";

export class TicketSystem {
  private notificationService: NotificationService;
  private level1Handler: Handler;

  constructor() {
    this.notificationService = new NotificationService();

    const managerHandler = new ManagerHandler();
    const seniorHandler = new SeniorHandler();
    const level2Handler = new Level2Handler();
    this.level1Handler = new Level1Handler();

    seniorHandler.setSuccessor(managerHandler);
    level2Handler.setSuccessor(seniorHandler);
    this.level1Handler.setSuccessor(level2Handler);
  }

  createTicket(ticketId: number, description: string, priority: Priority): void {
    const ticket = new Ticket(ticketId, description, priority);
    ticket.attach(this.notificationService);
    this.level1Handler.handleRequest(ticket);

    // Imprimir el historial del ticket
    console.log("\nHistorial del Ticket:");
    ticket.getHistory().forEach(entry => {
      console.log(`Estado: ${entry.status}, Hora: ${entry.timestamp}, Acción: ${entry.action || 'N/A'}`);
    });

    // Imprimir el tiempo de resolución
    const resolutionTime = ticket.getResolutionTime();
    if (resolutionTime !== null) {
      console.log(`\nTiempo de resolución: ${resolutionTime / 1000} segundos\n`);
    }
  }
}
