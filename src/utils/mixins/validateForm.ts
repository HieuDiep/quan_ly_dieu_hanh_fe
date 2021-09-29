import {tStr} from "validation_t/src"


export const validateEmail = (email: string):boolean =>{
    return tStr.isEmail(email);
}