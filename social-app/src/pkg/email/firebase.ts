import { INotificationProvider } from "./mail.interface";
import {App,initializeApp,cert} from "firebase-admin/app";
import { getMessaging, Message } from "firebase-admin/messaging";
export class FirebaseProvider implements INotificationProvider {

    private readonly client: App;
    constructor(config?: any) {
        this.client = initializeApp({
            credential: cert(config),
        });
        
    }
    async send(to: string, title: string, body: string): Promise<void> {
        
        console.log(`Sending email to ${to} with title "${title}" and body "${body}"`);
        const message:Message = {
            token: to,
            notification: {
                title: title,
                body: body,
            },
        };
        await getMessaging(this.client).send(message);
    }
}