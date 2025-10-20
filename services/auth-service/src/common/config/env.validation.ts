/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  JWT_SECRET_KEY: z.string().min(1, 'JWT secret key is required'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('10d'),
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
