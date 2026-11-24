import Mailjet from 'node-mailjet';
import { INotificationProvider } from './mail.interface';

interface ImailjetConfig {
    apikey: string;
    apiSecret: string;
    fromEmail: string;
    fromName: string;
}

export class MailjetProvider implements INotificationProvider {
    private client: Mailjet;
    private readonly fromEmail: string;
    private readonly fromName: string;

    constructor(config: ImailjetConfig) {
        this.client = new Mailjet({
            apiKey: config.apikey,
            apiSecret: config.apiSecret,
        });
        this.fromEmail = config.fromEmail;
        this.fromName = config.fromName;
    }

    async send(to: string, title: string, body: string): Promise<void> {
        await this.client.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: this.fromEmail,
                        Name: this.fromName,
                    },
                    To: [
                        {
                            Email: to,
                        },
                    ],
                    Subject: title,
                    TextPart: body,
                    HTMLPart: body,
                },
            ],
        });
    }

}

export const Maljetprovider = MailjetProvider;
