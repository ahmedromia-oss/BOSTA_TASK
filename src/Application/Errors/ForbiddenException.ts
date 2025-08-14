export class ForbiddenException extends Error {
  public statusCode: number;

  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenException";
    this.statusCode = 403;
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}
