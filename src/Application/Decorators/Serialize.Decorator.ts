import { Request, Response, NextFunction } from 'express';
import { SerializeInterceptor } from '../Interceptors/serialize.Interceptor.js';

/**
 * Method decorator for serializing response data using a DTO
 * @param dto Optional DTO class to serialize the response with
 */
export function serialize(dto?: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const interceptor = new SerializeInterceptor(dto);

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const res: Response = args[1];
      
      // Mock NestJS execution context structure for the interceptor
      const context = {
        switchToHttp: () => ({
          getRequest: () => req,
          getResponse: () => res,
        }),
      };

      // Wrapper for the original method to match expected interface
      const handler = {
        handle: async () => {
          return await originalMethod.apply(this, args);
        },
      };

      try {
        // Run the serialization interceptor on the method result
        const result = await interceptor.intercept(context, handler);
        return result;
      } catch (error) {
        // Re-throw any errors for upstream handling
        throw error;
      }
    };

    return descriptor;
  };
}