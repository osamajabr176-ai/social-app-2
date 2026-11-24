import { createTransport, Transporter } from 'nodemailer';
import { INotificationProvider } from './mail.interface';
import { env } from '../../lib/config/env';

interface InodemailerConfig {
    fromEmail: string;
    host: string;
    port: number;
    user: string;
    password: string;
}

export class NodemailerProvider implements INotificationProvider {
    private client: Transporter;
    private readonly fromEmail: string;

    constructor(config?: Partial<InodemailerConfig>) {
        this.fromEmail = config?.fromEmail || env.nodemailer.user;
        this.client = createTransport({
            host: config?.host || "smtp.gmail.com",
            port: config?.port || 587,
            secure: false,
            auth: {
                user: config?.user || env.nodemailer.user,
                pass: config?.password || env.nodemailer.pass,
            }
        });
    }

    async send(to: string, title: string, body: string): Promise<void> {
        await this.client.sendMail({
            from: this.fromEmail,
            to: to,
            subject: title,
            html: body
        });
    }

}

export const nodemailerprovider = new NodemailerProvider();
