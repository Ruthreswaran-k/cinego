import oracledb from 'oracledb';
import { env } from './env.js';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export async function initializeDatabase() {
  try {
    await oracledb.createPool({
      user: env.ORACLE_USER,
      password: env.ORACLE_PASSWORD,
      connectString: env.ORACLE_CONNECTION_STRING,
      poolMin: env.ORACLE_POOL_MIN,
      poolMax: env.ORACLE_POOL_MAX,
    });
    console.log('✅ Oracle Database pool initialized');

    const conn = await getConnection();
    const result = await conn.execute('SELECT 1 FROM DUAL');
    console.log('✅ Oracle Database connection verified', result.rows);
    await conn.close();
  } catch (error) {
    console.error('❌ Error initializing Oracle Database pool:', error);
    throw error;
  }
}

export async function getConnection(): Promise<oracledb.Connection> {
  try {
    return await oracledb.getConnection();
  } catch (error) {
    console.error('Error getting connection from pool:', error);
    throw error;
  }
}

export async function closePool() {
  try {
    await oracledb.getPool().close(10);
    console.log('✅ Oracle Database pool closed');
  } catch (error) {
    console.error('Error closing Oracle Database pool:', error);
  }
}

export async function executeQuery<T = any>(
  sql: string,
  bindParams: oracledb.BindParameters = {},
  options: oracledb.ExecuteOptions = { autoCommit: true }
): Promise<oracledb.Result<T>> {
  let connection;
  try {
    connection = await getConnection();
    return await connection.execute<T>(sql, bindParams, options);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

export async function executeProcedure(
  procedureName: string,
  params: oracledb.BindParameters = {}
): Promise<oracledb.Result<any>> {
  // Construct the BEGIN proc_name(...); END; statement dynamically based on params
  const paramKeys = Array.isArray(params) ? params.map((_, i) => `:${i+1}`) : Object.keys(params).map(k => `:${k}`);
  const sql = `BEGIN ${procedureName}(${paramKeys.join(', ')}); END;`;
  return executeQuery(sql, params);
}

export async function executeFunction(
  functionName: string,
  params: oracledb.BindParameters = {},
  returnType: any = oracledb.NUMBER
): Promise<any> {
    const paramKeys = Array.isArray(params) ? params.map((_, i) => `:${i+1}`) : Object.keys(params).map(k => `:${k}`);
    const sql = `BEGIN :result := ${functionName}(${paramKeys.join(', ')}); END;`;
    
    let bindParams: oracledb.BindParameters;
    if (Array.isArray(params)) {
        bindParams = [{ dir: oracledb.BIND_OUT, type: returnType }, ...params];
    } else {
        bindParams = { result: { dir: oracledb.BIND_OUT, type: returnType }, ...params };
    }

    const result = await executeQuery(sql, bindParams);
    return (result.outBinds as any).result;
}
