import { TicketSystem } from "./system/TicketSystem";
import { Priority } from "./enums/Priority";
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

interface Ticket {
    id: number;
    description: string;
    priority: Priority;
    status: string;
    createdAt: Date;
    estimatedCompletion: Date;
    resolvedBy?: string;
    resolvedByLevel?: string;
    history: Array<{
        status: string;
        timestamp: Date;
        action: string;
        estimatedTime?: string;
        timeElapsed?: string;
        resolvedBy?: string;
        resolvedByLevel?: string;
    }>;
    getHistory: () => Array<{
        status: string;
        timestamp: Date;
        action: string;
        estimatedTime?: string;
        timeElapsed?: string;
        resolvedBy?: string;
        resolvedByLevel?: string;
    }>;
    changeStatus: (status: string, resolvedBy?: string, resolvedByLevel?: string) => void;
}

class TicketManager {
  private ticketSystem: TicketSystem;
  private tickets: Map<number, Ticket>;

  constructor() {
    this.ticketSystem = new TicketSystem();
    this.tickets = new Map();
  }

  async showMenu() {
    while (true) {
      console.clear(); // Limpia la consola para mejor visualización
      console.log('\n=== Sistema de Gestión de Tickets ===');
      console.log('1. Crear nuevo ticket');
      console.log('2. Ver todos los tickets');
      console.log('3. Ver tickets abiertos');
      console.log('4. Ver tickets finalizados');
      console.log('5. Ver historial de un ticket');
      console.log('6. Cambiar estado de un ticket');
      console.log('7. Salir\n');

      const option = await this.askQuestion('Seleccione una opción: ');

      switch (option) {
        case '1':
          await this.createNewTicket();
          await this.pauseAndContinue();
          break;
        case '2':
          this.showAllTickets();
          await this.pauseAndContinue();
          break;
        case '3':
          this.showTicketsByStatus('Abierto');
          await this.pauseAndContinue();
          break;
        case '4':
          this.showTicketsByStatus('Resuelto');
          await this.pauseAndContinue();
          break;
        case '5':
          await this.showTicketHistory();
          await this.pauseAndContinue();
          break;
        case '6':
          await this.changeTicketStatus();
          await this.pauseAndContinue();
          break;
        case '7':
          console.log('Gracias por usar el sistema.');
          rl.close();
          return;
        default:
          console.log('Opción no válida. Intente nuevamente.');
          await this.pauseAndContinue();
      }
    }
  }

  private async pauseAndContinue(): Promise<void> {
    await this.askQuestion('\nPresione Enter para continuar...');
  }

  private async askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => rl.question(query, resolve));
  }

  private async createNewTicket() {
    try {
      console.log('\n=== Crear Nuevo Ticket ===');
      const ticketId = parseInt(await this.askQuestion('ID del ticket: '), 10);
      
      if (this.tickets.has(ticketId)) {
        console.log('Error: Ya existe un ticket con este ID.');
        return;
      }

      const description = await this.askQuestion('Descripción del ticket: ');
      const priority = parseInt(await this.askQuestion('Prioridad (1: Bajo, 2: Medio, 3: Alto, 4: Crítico): '), 10);

      if (isNaN(ticketId) || isNaN(priority) || priority < 1 || priority > 4) {
        console.log('Error: Datos inválidos. Por favor intente nuevamente.');
        return;
      }

      const ticket = this.ticketSystem.createTicket(ticketId, description, priority);
      this.tickets.set(ticketId, ticket);
      
      this.sendNotification(ticketId, `Nuevo ticket creado con prioridad ${Priority[priority]}`);
      console.log('\nTicket creado exitosamente!');
    } catch (error) {
      console.log('Error al crear el ticket:', error);
    }
  }

  private showAllTickets() {
    if (this.tickets.size === 0) {
        console.log('\nNo hay tickets registrados.');
        return;
    }

    console.log('\n=== Lista de todos los tickets ===');
    this.tickets.forEach((ticket, id) => {
        if (ticket && typeof ticket === 'object') {
            console.log(`Ticket #${id}`);
            console.log(`Estado: ${ticket.status || 'No definido'}`);
            console.log(`Prioridad: ${Priority[ticket.priority] || 'No definida'}`);
            console.log(`Descripción: ${ticket.description || 'Sin descripción'}`);
            console.log('------------------------');
        } else {
            console.log(`Error: Ticket #${id} no está correctamente formateado`);
        }
    });
}

  private showTicketsByStatus(status: string) {
    if (this.tickets.size === 0) {
        console.log('\nNo hay tickets registrados.');
        return;
    }

    const filteredTickets = Array.from(this.tickets.entries())
        .filter(([_, ticket]) => {
            return ticket && ticket.status === status;
        });

    if (filteredTickets.length === 0) {
        console.log(`\nNo hay tickets en estado: ${status}`);
        return;
    }

    console.log(`\n=== Tickets en estado: ${status} ===`);
    filteredTickets.forEach(([id, ticket]) => {
        console.log(`Ticket #${id}`);
        console.log(`Prioridad: ${Priority[ticket.priority]}`);
        console.log(`Descripción: ${ticket.description}`);
        console.log('------------------------');
    });
}

  private async showTicketHistory() {
    const ticketId = parseInt(await this.askQuestion('Ingrese el ID del ticket: '), 10);
    const ticket = this.tickets.get(ticketId);

    if (!ticket) {
        console.log('\nTicket no encontrado.');
        return;
    }

    console.log(`\n=== Historial del Ticket #${ticketId} ===`);
    console.log(`Creado: ${ticket.createdAt.toLocaleString()}`);
    console.log(`Tiempo estimado de resolución: ${this.formatDate(ticket.estimatedCompletion)}`);
    if (ticket.resolvedBy && ticket.resolvedByLevel) {
        console.log(`Resuelto por: ${ticket.resolvedBy} (${ticket.resolvedByLevel})`);
    }
    console.log('\nHistorial de cambios:');
    
    ticket.getHistory().forEach((entry: any) => {
        console.log(`\nFecha: ${new Date(entry.timestamp).toLocaleString()}`);
        console.log(`Estado: ${entry.status}`);
        console.log(`Acción: ${entry.action}`);
        if (entry.estimatedTime) {
            console.log(`Tiempo estimado: ${entry.estimatedTime}`);
        }
        if (entry.timeElapsed) {
            console.log(`Tiempo transcurrido: ${entry.timeElapsed}`);
        }
        if (entry.resolvedBy && entry.resolvedByLevel) {
            console.log(`Resuelto por: ${entry.resolvedBy} (${entry.resolvedByLevel})`);
        }
        console.log('------------------------');
    });
}

  private formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutos`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours} horas y ${minutes} minutos`;
    } else {
      return date.toLocaleString();
    }
  }

  private async changeTicketStatus() {
    const ticketId = parseInt(await this.askQuestion('ID del ticket: '), 10);
    const ticket = this.tickets.get(ticketId);

    if (!ticket) {
        console.log('Error: Ticket no encontrado.');
        return;
    }

    console.log('\nEstados disponibles:');
    console.log('1. Abierto');
    console.log('2. En Proceso');
    console.log('3. Resuelto');
    
    const statusOption = await this.askQuestion('Seleccione el nuevo estado (1-3): ');
    let newStatus: string;

    switch (statusOption) {
        case '1': newStatus = 'Abierto'; break;
        case '2': newStatus = 'En Proceso'; break;
        case '3': newStatus = 'Resuelto'; break;
        default:
            console.log('Error: Opción no válida');
            return;
    }

    if (newStatus === 'Resuelto') {
        const resolvedBy = await this.askQuestion('Ingrese el nombre de quien resolvió el ticket: ');
        console.log('\nNivel de resolución:');
        console.log('1. Level 1');
        console.log('2. Level 2');
        console.log('3. Senior');
        console.log('4. Manager');
        
        const levelOption = await this.askQuestion('Seleccione el nivel (1-4): ');
        let resolvedByLevel: string;
        
        switch (levelOption) {
            case '1': resolvedByLevel = 'Level 1'; break;
            case '2': resolvedByLevel = 'Level 2'; break;
            case '3': resolvedByLevel = 'Senior'; break;
            case '4': resolvedByLevel = 'Manager'; break;
            default:
                console.log('Error: Nivel no válido');
                return;
        }
        
        ticket.changeStatus(newStatus, resolvedBy, resolvedByLevel);
        console.log(`\nTicket resuelto por ${resolvedBy} (${resolvedByLevel})`);
    } else {
        ticket.changeStatus(newStatus);
    }
  }

  private sendNotification(ticketId: number, message: string) {
    console.log('\n=== Simulación de Notificación ===');
    console.log(`Enviando email a support@company.com`);
    console.log(`Asunto: Actualización Ticket #${ticketId}`);
    console.log(`Mensaje: ${message}`);
    console.log('Notificación enviada exitosamente\n');
  }
}

// Iniciar la aplicación
const ticketManager = new TicketManager();
ticketManager.showMenu().catch(console.error);
