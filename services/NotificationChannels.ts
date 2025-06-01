interface NotificationChannel {
    send(message: string, recipient: string): void;
}

export class EmailNotification implements NotificationChannel {
    send(message: string, recipient: string): void {
        console.log(`\n=== Enviando Email ===`);
        console.log(`Para: ${recipient}`);
        console.log(`Mensaje: ${message}`);
        console.log(`=== Email Enviado ===\n`);
    }
}

export class SlackNotification implements NotificationChannel {
    send(message: string, recipient: string): void {
        console.log(`\n=== Enviando mensaje Slack ===`);
        console.log(`Canal: ${recipient}`);
        console.log(`Mensaje: ${message}`);
        console.log(`=== Mensaje Slack Enviado ===\n`);
    }
}

export class WhatsAppNotification implements NotificationChannel {
    send(message: string, recipient: string): void {
        console.log(`\n=== Enviando WhatsApp ===`);
        console.log(`Para: ${recipient}`);
        console.log(`Mensaje: ${message}`);
        console.log(`=== WhatsApp Enviado ===\n`);
    }
}