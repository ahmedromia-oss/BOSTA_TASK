export class BadRequestException extends Error {
  public statusCode: number;
  public errors: string[] | Record<string, any>;

  constructor(errors: string[] | Record<string, any>, message = "Bad Request") {
    super(message);
    console.log(message)
    this.name = "BadRequestException";
    this.statusCode = 400;
    this.errors = errors;
    // restore prototype chain for instanceof checks
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }

  // ensures JSON serialization includes our fields
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errors: this.errors,
    };
  }
}
