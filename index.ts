import { TicketSystem } from "./system/TicketSystem";
import { Priority } from "./enums/Priority";
import * as readline from 'readline';

// Configuración de la interfaz de lectura
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Instancia del sistema de tickets
const ticketSystem = new TicketSystem();

// Función para hacer preguntas al usuario
function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Función principal para manejar la interacción con el usuario
async function main() {
  console.log('Bienvenido al Sistema de Gestión de Tickets\n');

  while (true) {
    console.log('Opciones:');
    console.log('1. Crear un nuevo ticket');
    console.log('2. Salir\n');

    const option = await askQuestion('Por favor, seleccione una opción: ');

    if (option === '2') {
      console.log('Saliendo del sistema...');
      rl.close();
      return;
    } else if (option === '1') {
      const ticketId = parseInt(await askQuestion('Ingrese el ID del ticket: '), 10);
      const description = await askQuestion('Ingrese la descripción del ticket: ');
      const priority = parseInt(await askQuestion('Ingrese la prioridad del ticket (1: Bajo, 2: Medio, 3: Alto, 4: Crítico): '), 10);

      if (isNaN(ticketId) || isNaN(priority) || priority < 1 || priority > 4) {
        console.log('Entrada no válida. Por favor, intente de nuevo.\n');
        continue;
      }

      // Crear el ticket con los datos ingresados por el usuario
      ticketSystem.createTicket(ticketId, description, priority);
    } else {
      console.log('Opción no válida. Por favor, intente de nuevo.\n');
    }
  }
}

// Ejecutar la función principal
main().catch(console.error);
