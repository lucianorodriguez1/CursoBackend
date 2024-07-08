import mongoose from 'mongoose';
import config from '../config/config.js';
import CustomError from '../services/errors/CustomError.js';
import {ErrorCodes } from '../services/errors/enums.js';


export async function connnectDB() {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log('mongodb connected to app');
  } catch (error) {
    console.error('Error connecting to MongoDB');
    if (error.name === 'MongoNetworkError') {
      console.log('Retrying connection in 5 seconds...');
      CustomError.createError({
        name: 'error de conexion del servidor',
        cause: 'se tardo mucho tiempo en conectarse a la ddbb',
        message: 'Error conexion a la base de datos',
        code: ErrorCodes.DATABASE_ERROR
      });
    }
  }
}
