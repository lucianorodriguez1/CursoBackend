import mongoose from "mongoose";
import config from "../config/config.js";

export async function connnectDB() {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("*****DB CONNECT FROM APP****");
  } catch (error) {
    console.log(`***ERRROR NO SE PUEDO CONECTAR A LA DB***, ${error}`);
  }
}
