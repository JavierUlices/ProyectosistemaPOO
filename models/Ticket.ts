import { Observer } from "../interface/Observer";
import { Priority } from "../enums/Priority";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export class Ticket {
  private observers: Observer[] = [];
  private history: Array<{ status: string; timestamp: Date; action?: string }> = [];
  private creationTime: Date;
  private resolutionTime: Date | null = null;
  private escalations: number = 0;

  constructor(
    public ticketId: number,
    public description: string,
    public priority: Priority
  ) {
    this.status = "Abierto";
    this.creationTime = new Date();
    this.history.push({ status: "Abierto", timestamp: this.creationTime, action: "Creación del ticket" });
  }

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  changeStatus(
    status: string, 
    resolvedBy?: string, 
    resolvedByLevel?: string,
    resolutionTime?: number,
    resolutionDate?: Date
  ): void {
    const now = new Date();
    this.history.push({ status, timestamp: now, action: resolvedBy ? `Resuelto por ${resolvedBy} (${resolvedByLevel})` : 'N/A' });
    this.status = status;
    if (status === "Resuelto") {
      this.resolutionTime = resolutionDate || now;
    }
    this.notify();
  }

  incrementEscalations(): void {
    this.escalations++;
    this.history.push({ status: this.status, timestamp: new Date(), action: "Escalación del ticket" });
  }

  getHistory(): Array<{ status: string; timestamp: Date; action?: string }> {
    return this.history;
  }

  getResolutionTime(): number | null {
    if (this.resolutionTime) {
      return this.resolutionTime.getTime() - this.creationTime.getTime();
    }
    return null;
  }

  setResolutionTime(resolutionTime: number): void {
    this.resolutionTime = new Date(this.creationTime.getTime() + resolutionTime);
  }

  public status: string;
}

// Agregar a models/Ticket.ts
interface TicketMetrics {
    timeToResolution: number;
    escalationCount: number;
    responseTime: number;
    slaCompliance: boolean;
}
