export class NotFoundException extends Error {
  public statusCode: number;

  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundException";
    this.statusCode = 404;
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}
