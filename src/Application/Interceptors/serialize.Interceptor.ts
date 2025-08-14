import { plainToInstance } from "class-transformer";
import { Code } from "../../Domain/constants.js";
import { UserToken } from "../../Domain/Models/userToken.model.js";
import { ServiceResponse } from "../../Domain/Models/ServiceReponse.model.js";
import { Request, Response } from "express";

// Custom interceptor interface for Node.js/Express environments
export interface NodeInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Promise<any>;
}

// Mimics NestJS ExecutionContext for compatibility
export interface ExecutionContext {
  switchToHttp(): {
    getRequest(): Request;
    getResponse(): Response;
  };
}

// Handler interface for wrapping the original method call
export interface CallHandler {
  handle(): Promise<any>;
}

/**
 * Interceptor for serializing response data using DTOs
 * Transforms raw data into specified DTO format before sending response
 */
export class SerializeInterceptor implements NodeInterceptor {
  constructor(private dto?: any) {}

  async intercept(context: ExecutionContext, handler: CallHandler): Promise<any> {
    // Call the original route handler and get the result
    const data = await handler.handle();
    
    // Transform data using DTO if provided, otherwise use raw data
    const serializedData = this.dto
      ? plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // Only include properties marked with @Expose()
        })
      : data;

    // Send standardized response format with success code
    return context.switchToHttp().getResponse().status(200).send({
      code: Code.SUCCESS,
      data: serializedData,
    } as ServiceResponse<any>);
  }
}