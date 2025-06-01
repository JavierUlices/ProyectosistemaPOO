export interface NotificationPreference {
    email?: string;
    slack?: string;
    whatsapp?: string;
}

export class Client {
    constructor(
        public id: number,
        public name: string,
        public company: string,
        public notificationPreferences: NotificationPreference
    ) {}
}