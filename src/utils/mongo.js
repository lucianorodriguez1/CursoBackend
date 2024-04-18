import mongoose from "mongoose";

export async function connnectDB() {
  try {
    await mongoose.connect(process.env.URL_MONGODB);
    console.log("*****DB CONNECT FROM APP****");
  } catch (error) {
    console.log(`***ERRROR NO SE PUEDO CONECTAR A LA DB***, ${error}`);
  }
}
