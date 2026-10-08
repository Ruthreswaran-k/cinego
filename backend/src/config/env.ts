import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  ORACLE_USER: z.string().default('cinego_user'),
  ORACLE_PASSWORD: z.string().default('cinego_pass'),
  ORACLE_CONNECTION_STRING: z.string().default('localhost:1522/XEPDB1'),
  ORACLE_POOL_MIN: z.string().transform(Number).default('2'),
  ORACLE_POOL_MAX: z.string().transform(Number).default('10'),

  SUPABASE_URL: z.string().url().default('https://mock-cinego.supabase.co'),
  SUPABASE_ANON_KEY: z.string().default('mock_cinego_anon_key_for_development_2026'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('mock_cinego_service_role_key_for_development_2026'),

  JWT_SECRET: z.string().default('cinego_jwt_super_secure_college_key_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  FRONTEND_URL: z.string().url().default('http://localhost:5173')
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.warn('⚠️ Environment variable warnings:', _env.error.format());
}

export const env = _env.success ? _env.data : envSchema.parse({});
