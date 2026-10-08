import app from './app.js';
import { env } from './config/env.js';
import { initializeDatabase, closePool } from './config/database.js';

async function startServer() {
  console.log('='.repeat(60));
  console.log('🎬 CINEGO — FULL-STACK MOVIE TICKET BOOKING SYSTEM');
  console.log(`>> Environment: ${env.NODE_ENV}`);
  console.log(`>> Target Database: ${env.ORACLE_CONNECTION_STRING} (${env.ORACLE_USER})`);
  console.log('='.repeat(60));

  try {
    await initializeDatabase();
  } catch (dbError: any) {
    console.warn('\n⚠️ [ORACLE 21c XE NOTICE]');
    console.warn(`Could not connect to Oracle at ${env.ORACLE_CONNECTION_STRING}`);
    console.warn(`Reason: ${dbError?.message || dbError}`);
    console.warn('👉 Ensure Oracle 21c XE service is running and credentials match in .env');
    console.warn('👉 Run @c:\\Users\\RUTHRA\\Documents\\projectWE\\CineGo\\database\\run_all.sql to setup schema');
    console.warn('🚀 Starting server in development mode so REST API and Frontend are fully usable!\n');
  }

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 CineGo REST API running on http://localhost:${env.PORT}`);
    console.log(`👉 Health check: http://localhost:${env.PORT}/api/locations`);
  });

  const shutdown = async () => {
    console.log('Shutting down server...');
    server.close(async () => {
      console.log('HTTP server closed.');
      await closePool();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
