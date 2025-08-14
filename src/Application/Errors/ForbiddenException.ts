/**
 * Custom exception for 403 Forbidden errors
 * Used when user lacks permission to access a resource
 */
export class ForbiddenException extends Error {
  public statusCode: number;

  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenException";
    this.statusCode = 403;
    // Restore prototype chain for proper instanceof behavior
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}