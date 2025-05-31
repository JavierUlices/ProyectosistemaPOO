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

  private calculateProcessingTime(priority: Priority): number {
    // Tiempo base en minutos
    switch (priority) {
        case Priority.Critico:
            return 120; // 2 horas
        case Priority.Alto:
            return 60;  // 1 hora
        case Priority.Medio:
            return 30;  // 30 minutos
        case Priority.Bajo:
            return 15;  // 15 minutos
        default:
            return 60;
    }
  }

  createTicket(ticketId: number, description: string, priority: Priority): Ticket {
    const processingTime = this.calculateProcessingTime(priority);
    const currentDate = new Date();
    const estimatedCompletion = new Date(currentDate.getTime() + processingTime * 60000);

    const ticket = {
        id: ticketId,
        description,
        priority,
        status: 'Abierto',
        createdAt: currentDate,
        estimatedCompletion,
        resolvedBy: undefined,
        history: [{
            status: 'Abierto',
            timestamp: currentDate,
            action: 'Ticket creado',
            estimatedTime: `${processingTime} minutos`
        }],
        getHistory() {
            return this.history;
        },
        changeStatus(newStatus: string, resolvedBy?: string) {
            const timestamp = new Date();
            const timeElapsed = Math.floor((timestamp.getTime() - this.createdAt.getTime()) / 60000);
            
            this.status = newStatus;
            if (newStatus === 'Resuelto') {
                this.resolvedBy = resolvedBy;
            }
            
            this.history.push({
                status: newStatus,
                timestamp,
                action: 'Cambio de estado',
                timeElapsed: `${timeElapsed} minutos`,
                resolvedBy: resolvedBy
            });
        }
    };

    return ticket;
  }
}
