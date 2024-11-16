import { SetMetadata } from '@nestjs/common';

/**
 * Custom decorator to set permissions for route handlers.
 * @param {...string[]} permissions - The permissions required to access the route.
 */
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
