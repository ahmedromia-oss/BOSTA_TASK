export class UnAuthorizedException extends Error {
  public statusCode: number;

  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnAuthorizedException";
    this.statusCode = 401;
    Object.setPrototypeOf(this, UnAuthorizedException.prototype);
  }
}
