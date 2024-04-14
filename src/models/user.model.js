import { Schema } from "mongoose";
import { MongoDBManager } from "../dao/MongoDB/MongoDBManager.js";

const userCollection = "users";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    default: "user",
  },
});

export class UserMongoDBManager extends MongoDBManager {
  constructor() {
    super(process.env.URL_MONGODB, userCollection, userSchema);
  }
}

export const userManager = new UserMongoDBManager();
