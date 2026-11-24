import {OAuth2Client} from "google-auth-library";
import { AppError } from "../error/error";
import { env } from "../config/env"; 

        const client = new OAuth2Client({clientId: env.google.clientId });

 export async function verifyGoogletoken(idToken:string){
    try {
        const ticket =  await client.verifyIdToken({idToken: idToken,
            audience: env.google.clientId,
     } );
        return ticket.getPayload() ;
    } catch(err) {
        throw  new  AppError('invalid google token',403);
    }

}