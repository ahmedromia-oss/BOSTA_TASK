import { plainToInstance } from "class-transformer";
import { Code } from "../../Domain/constants.js";
import { UserToken } from "../../Domain/Models/userToken.model.js";
import { ServiceResponse } from "../../Domain/Models/ServiceReponse.model.js";
import { Request, Response } from "express";
export interface NodeInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Promise<any>;
}
export interface ExecutionContext {
  switchToHttp(): {
    getRequest(): Request;
    getResponse(): Response;
  };
}

export interface CallHandler {
  handle(): Promise<any>;
}

export class SerializeInterceptor implements NodeInterceptor {
  constructor(private dto?: any) {}

  async intercept(context: ExecutionContext, handler: CallHandler): Promise<any> {
   
    
    // Execute the handler (route handler)
    const data = await handler.handle();
    
    // Transform and serialize the response
    return context.switchToHttp().getResponse().status(200).send({
      code: Code.SUCCESS,
      data: this.dto
        ? plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          })
        : data,
    } as ServiceResponse<any>);
  }
}