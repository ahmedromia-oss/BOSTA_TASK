import { Request, Response, NextFunction } from 'express';
import { SerializeInterceptor } from '../Interceptors/serialize.Interceptor.js';

// Method decorator for serialization
export function serialize(dto?: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const interceptor = new SerializeInterceptor(dto);

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const res: Response = args[1];
      
      // Create execution context
      const context = {
        switchToHttp: () => ({
          getRequest: () => req,
          getResponse: () => res,
        }),
      };

      // Create call handler
      const handler = {
        handle: async () => {
          return await originalMethod.apply(this, args);
        },
      };

      try {
        // Execute interceptor
        const result = await interceptor.intercept(context, handler);
        return result;
      } catch (error) {
        throw error;
      }
    };

    return descriptor;
  };
}