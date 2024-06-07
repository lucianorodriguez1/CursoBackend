export default class customErrors{
    static createError({name = "Error",cause,message,code = 1}){
        error.name = name;
        error.code = code;

        throw error;
    }
}