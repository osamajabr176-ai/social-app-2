import { gender } from "../lib/enum/enum";

export interface registerDto {
    userName : string ;
    email : string ;
    password:string ;
    phoneNumber?: string ;
      gender ?: string ,
    provider ?: string
    
}
export interface loginrDto {
    email : string ;
    psssword : string
    
}
export interface sendDto {
    
    email : string ;
  
    
}
export interface verifyAccountDto {
   
    email : string ;
   code :string
    
}