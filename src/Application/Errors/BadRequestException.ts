/**
 * Custom exception for 400 Bad Request errors
 * Handles both array of error strings and structured error objects
 */
export class BadRequestException extends Error {
  public statusCode: number;
  public errors: string[] | Record<string, any>;

  constructor(errors: string[] | Record<string, any>, message = "Bad Request") {
    super(message);
    this.name = "BadRequestException";
    this.statusCode = 400;
    this.errors = errors;
    // Fix for TypeScript inheritance - ensures instanceof works correctly
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }

  // Custom JSON serialization to include all relevant error data
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errors: this.errors,
    };
  }
}