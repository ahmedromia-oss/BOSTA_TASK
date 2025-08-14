// src/Infrastructure/Container/DIContainer.ts
export class DIContainer {
  private services = new Map<symbol | Function, any>();
  private singletons = new Map<symbol | Function, any>();

  /**
   * Register a service with symbol token (for interfaces)
   */
register<T>(token: symbol, registration: (() => T) | { useFactory: (container: DIContainer) => T }): void {
  this.services.set(token, registration);
}
  registerInterface<T>(token: symbol, factory: () => T, singleton: boolean = true): void {
    this.services.set(token, { factory, singleton });
  }

  /**
   * Register a service with class constructor (for concrete classes)
   */
  registerClass<T>(token: new (...args: any[]) => T, factory: () => T, singleton: boolean = true): void {
    this.services.set(token, { factory, singleton });
  }

  /**
   * Resolve a service by token
   */
resolve<T>(token: symbol): T {
    const service = this.services.get(token);
    if (!service) {
      throw new Error(`Service not registered: ${token.toString()}`);
    }
    
    // Handle direct function
    if (typeof service === 'function') {
      return service();
    }
    
    // Handle object with factory method
    if (service && typeof service === 'object' && typeof service.factory === 'function') {
      return service.factory();
    }
    
    // Handle object with useFactory method
    if (service && typeof service === 'object' && typeof service.useFactory === 'function') {
      return service.useFactory(this);
    }
    
    // Return direct instance
    return service;
  }

  /**
   * Check if service is registered
   */
  isRegistered(token: symbol | Function): boolean {
    return this.services.has(token);
  }

  /**
   * Clear all services (for testing)
   */
  clear(): void {
    this.services.clear();
    this.singletons.clear();
  }
}

// Service tokens
export const SERVICE_TOKENS = {
  IUserService: Symbol('IUserService'),
  IUserController: Symbol('IUserController'),
} as const;

