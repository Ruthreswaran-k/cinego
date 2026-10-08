import { executeProcedure, executeQuery } from '../config/database.js';
import { Customer, UserRole } from '../types/index.js';
import oracledb from 'oracledb';

export class AuthRepository {
  async registerCustomer(name: string, email: string, mobile: string, passwordHash: string): Promise<string> {
    const result = await executeProcedure('REGISTER_CUSTOMER', {
      p_name: name,
      p_email: email,
      p_mobile: mobile,
      p_password: passwordHash,
      p_customer_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
    });
    return (result.outBinds as any).p_customer_id;
  }

  async getCustomerByEmail(email: string): Promise<Customer & { passwordHash: string } | null> {
    const sql = `SELECT id, name, email, mobile, role, password_hash as "passwordHash" 
                 FROM users WHERE email = :email`;
    const result = await executeQuery(sql, { email });
    if (result.rows && result.rows.length > 0) {
      return result.rows[0] as any;
    }
    return null;
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const sql = `SELECT id, name, email, mobile, role FROM users WHERE id = :id`;
    const result = await executeQuery(sql, { id });
    if (result.rows && result.rows.length > 0) {
      return result.rows[0] as Customer;
    }
    return null;
  }

  async updateCustomerProfile(id: string, name: string, mobile: string): Promise<void> {
    const sql = `UPDATE users SET name = :name, mobile = :mobile WHERE id = :id`;
    await executeQuery(sql, { name, mobile, id });
  }
}

export const authRepository = new AuthRepository();
