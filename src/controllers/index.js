import * as productsControllers from './products.controllers.js';
import * as usersControllers from './user.controllers.js';
import * as sessionsControllers from './session.controllers.js';
import * as cartsControllers from './carts.controllers.js';
import * as viewsControllers from './views.controllers.js';

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
export const users = wrapAsyncFunctions(usersControllers);
export const sessions = wrapAsyncFunctions(sessionsControllers);
export const carts = wrapAsyncFunctions(cartsControllers);
export const views = wrapAsyncFunctions(viewsControllers);
