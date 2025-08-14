/**
 * Custom exception for 404 Not Found errors
 * Thrown when a requested resource doesn't exist
 */
export class NotFoundException extends Error {
  public statusCode: number;

  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundException";
    this.statusCode = 404;
    // Fix prototype chain for correct instanceof checks
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}