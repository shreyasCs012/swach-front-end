import { z } from 'zod';
import { 
  insertUserSchema, 
  insertProductSchema, 
  users, 
  products, 
  orders,
  type OrderWithItemsResponse
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
 products: {
  list: {
    method: 'GET' as const,
    path: '/api/products',
    input: z.object({
      search: z.string().optional(),
    }).optional(),
    responses: {
      200: z.array(z.custom<typeof products.$inferSelect>()),
    },
  },

  get: {
    method: 'GET' as const,
    path: '/api/products/:id',
    responses: {
      200: z.custom<typeof products.$inferSelect>(),
      404: errorSchemas.notFound,
    },
  },

  create: {
    method: 'POST' as const,
    path: '/api/products',
    input: insertProductSchema,
    responses: {
      201: z.custom<typeof products.$inferSelect>(),
      400: errorSchemas.validation,
    },
  },

  update: {
    method: 'PUT' as const,
    path: '/api/products/:id',
    input: insertProductSchema.partial(),
    responses: {
      200: z.custom<typeof products.$inferSelect>(),
      404: errorSchemas.notFound,
    },
  },

  // ✅ NEW DELETE ROUTE
  delete: {
    method: 'DELETE' as const,
    path: '/api/products/:id',
    responses: {
      200: z.object({
        success: z.boolean(),
      }),
      404: errorSchemas.notFound,
    },
  },
},
  orders: {
    list: {
      method: 'GET' as const,
      path: '/api/orders',
      responses: {
        200: z.array(z.custom<OrderWithItemsResponse>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/orders/:id',
      responses: {
        200: z.custom<OrderWithItemsResponse>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: z.object({
        deliveryAddress: z.string(),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number().min(1),
        })),
      }),
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/orders/:id/status',
      input: z.object({
        status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      }),
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.custom<OrderWithItemsResponse>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
