import { Schema } from "mongoose";
import { MongoDBManager } from "../dao/MongoDB/MongoDBManager.js";

const messageCollection = 'messages';

const messageSchema = new Schema({
    user:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})

export class MessageMongoDBManager extends MongoDBManager{
    constructor(){
        super(process.env.URL_MONGODB, messageCollection,messageSchema);
    }
}

export const messageManager = new MessageMongoDBManager();