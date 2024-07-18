import mongoose from 'mongoose';
import config from '../config/config.js';
import CustomError from './errors/CustomError.js';
import {ErrorCodes } from './errors/enums.js';


export async function connnectDB() {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log('mongodb connected to app');
  } catch (error) {
    console.log('Error connecting to MongoDB');
    if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
      CustomError.createError({
        name: 'error de conexion del servidor',
        cause: 'se tardo mucho tiempo en conectarse a la ddbb',
        message: 'Error conexion a la base de datos',
        code: ErrorCodes.DATABASE_ERROR
      });
    }
  }
}
