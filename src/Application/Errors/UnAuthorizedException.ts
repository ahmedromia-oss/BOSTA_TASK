/**
 * Custom exception for 401 Unauthorized errors
 * Used when authentication is required but missing or invalid
 */
export class UnAuthorizedException extends Error {
  public statusCode: number;

  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnAuthorizedException";
    this.statusCode = 401;
    // Maintain proper prototype chain for instanceof operations
    Object.setPrototypeOf(this, UnAuthorizedException.prototype);
  }
}