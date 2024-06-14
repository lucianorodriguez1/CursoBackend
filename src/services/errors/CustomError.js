export default class customError {
  static createError({ name = "Error", cause, message, code = 2 }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;

    throw error;
  }
}
