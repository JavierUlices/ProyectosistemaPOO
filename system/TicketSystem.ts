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
            return 240; // 4 horas para casos críticos
        case Priority.Alto:
            return 180; // 3 horas para prioridad alta
        case Priority.Medio:
            return 120; // 2 horas para prioridad media
        case Priority.Bajo:
            return 60;  // 1 hora para prioridad baja
        default:
            return 120; // 2 horas por defecto
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
        resolvedByLevel: undefined, // Agregamos el nivel del resolutor
        history: [{
            status: 'Abierto',
            timestamp: currentDate,
            action: 'Ticket creado',
            estimatedTime: `${processingTime} minutos`
        }],
        getHistory() {
            return this.history;
        },
        changeStatus(
            newStatus: string, 
            resolvedBy?: string, 
            resolvedByLevel?: string,
            resolutionTime?: number,
            resolutionDate?: Date
        ) {
            const timestamp = resolutionDate || new Date();
            const timeElapsed = resolutionTime || 
                Math.floor((timestamp.getTime() - this.createdAt.getTime()) / 60000);
            
            this.status = newStatus;
            if (newStatus === 'Resuelto') {
                this.resolvedBy = resolvedBy;
                this.resolvedByLevel = resolvedByLevel;
            }
            
            this.history.push({
                status: newStatus,
                timestamp,
                action: 'Cambio de estado',
                timeElapsed: `${timeElapsed} minutos`,
                resolvedBy: resolvedBy,
                resolvedByLevel: resolvedByLevel,
                details: resolvedByLevel ? 
                    `Resuelto por ${resolvedBy} (${resolvedByLevel}) el ${timestamp.toLocaleString()}` : 
                    undefined
            });
        }
    };

    return ticket;
  }
}

// Agregar a system/TicketSystem.ts
interface SLAPolicy {
    priority: Priority;
    maxResolutionTime: number;
    escalationTime: number;
}

const SLA_POLICIES: Record<Priority, SLAPolicy> = {
    [Priority.Critico]: { priority: Priority.Critico, maxResolutionTime: 240, escalationTime: 60 },
    [Priority.Alto]: { priority: Priority.Alto, maxResolutionTime: 180, escalationTime: 45 },
    [Priority.Medio]: { priority: Priority.Medio, maxResolutionTime: 120, escalationTime: 30 },
    [Priority.Bajo]: { priority: Priority.Bajo, maxResolutionTime: 60, escalationTime: 15 }
};
