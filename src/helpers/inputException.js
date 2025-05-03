const ERROR_MSG = 'Invalid input';

export class InputException extends Error {
  constructor(message = ERROR_MSG) {
    super(message);
    this.name = 'InputException';
  }
}
