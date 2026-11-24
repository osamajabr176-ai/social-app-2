import { env } from "../../lib/config/env";
import { MailjetProvider } from "./mailjet";

export const mailjetprovider = new MailjetProvider({
    apikey: env.mailjet.apiKey,
    apiSecret: env.mailjet.apisecret,
    fromEmail: env.mailjet.fromemail,
    fromName: env.mailjet.fromname,
});
