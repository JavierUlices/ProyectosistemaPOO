import { Observer } from "../interface/Observer";
import { Ticket } from "../models/Ticket";
import { Client } from "../models/Client";
import { EmailNotification, SlackNotification, WhatsAppNotification } from "./NotificationChannels";

export class NotificationService implements Observer {
    private emailChannel: EmailNotification;
    private slackChannel: SlackNotification;
    private whatsAppChannel: WhatsAppNotification;

    constructor() {
        this.emailChannel = new EmailNotification();
        this.slackChannel = new SlackNotification();
        this.whatsAppChannel = new WhatsAppNotification();
    }

    notifyClient(client: Client, ticket: Ticket, message: string): void {
        const { notificationPreferences } = client;

        if (notificationPreferences.email) {
            this.emailChannel.send(message, notificationPreferences.email);
        }
        if (notificationPreferences.slack) {
            this.slackChannel.send(message, notificationPreferences.slack);
        }
        if (notificationPreferences.whatsapp) {
            this.whatsAppChannel.send(message, notificationPreferences.whatsapp);
        }
    }

    update(ticket: Ticket): void {
        console.log(`Notificación: Ticket ${ticket.ticketId} estado cambiado a ${ticket.status}`);
    }
}
