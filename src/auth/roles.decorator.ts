import { SetMetadata } from '@nestjs/common';

/**
 * Custom decorator to set roles for route handlers.
 * @param {...string[]} roles - The roles required to access the route.
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
