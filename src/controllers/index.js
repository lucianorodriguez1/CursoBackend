import * as productsControllers from './products.controllers.js';
import { catchedAsync } from '../utils/catchedAsync.js';

const wrapAsyncFunctions = (controller) => {
  const wrappedController = {};
  for (const [key, value] of Object.entries(controller)) {
    if (typeof value === 'function') {
      wrappedController[key] = catchedAsync(value);
    } else {
      wrappedController[key] = value;
    }
  }
  return wrappedController;
};

export const products = wrapAsyncFunctions(productsControllers);
