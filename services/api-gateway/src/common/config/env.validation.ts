/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { z } from 'zod';

const envSchema = z.object({
  AGENTFLOW_SERVICE_URL: z.string().default('agentflow-service:50052'),
  AUTH_SERVICE_URL: z.string().default('auth-service:50051'),
  CORS_ALLOWED_HEADERS: z.string().default('Content-Type, Authorization, Origin'),
  CORS_CREDENTIALS: z
    .string()
    .transform((v) => v.toLowerCase() === 'true')
    .default(true),
  CORS_EXPOSED_HEADERS: z.string().default(''),
  CORS_METHODS: z.string().default('GET, POST, DELETE, PATCH'),
  CORS_ORIGINS: z.string().default('http://localhost:3001, http://localhost:4200'),
  GITHUB_TOKEN: z.string().min(1, 'GitHub token is required'),
  GITHUB_WEBHOOK_SECRET: z.string().min(1, 'GitHub webhook secret is required'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('10d'),
  JWT_SECRET_KEY: z.string().min(1, 'JWT secret key is required'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Invalid environment variables: ${message}`);
  }

  return parsed.data;
}
