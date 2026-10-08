import jwt from 'jsonwebtoken';
import { authRepository } from '../repositories/authRepository.js';
import { Customer, AuthPayload, UserRole } from '../types/index.js';
import { env } from '../config/env.js';
import { UnauthorizedError, ConflictError } from '../utils/errors.js';
import crypto from 'crypto';

// Development in-memory user registry for when Oracle is running in mock/offline mode
const devUsers = new Map<string, any>([
  ['ravi@gmail.com', {
    id: '1003',
    name: 'Ravi Kumar',
    email: 'ravi@gmail.com',
    mobile: '9000000011',
    passwordHash: crypto.createHash('sha256').update('ravi@1234').digest('hex'),
    role: UserRole.CUSTOMER
  }],
  ['9000000011', {
    id: '1003',
    name: 'Ravi Kumar',
    email: 'ravi@gmail.com',
    mobile: '9000000011',
    passwordHash: crypto.createHash('sha256').update('ravi@1234').digest('hex'),
    role: UserRole.CUSTOMER
  }],
]);

export class AuthService {
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  private generateToken(user: Customer): string {
    return jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );
  }

  async registerCustomer(name: string, email: string, mobile: string, password: string): Promise<AuthPayload> {
    const passwordHash = this.hashPassword(password);
    const cleanedMobile = mobile.replace(/[^0-9]/g, '').slice(-10);

    try {
      const existing = await authRepository.getCustomerByEmail(email);
      if (existing) {
        throw new ConflictError('This email is already registered');
      }
      const id = await authRepository.registerCustomer(name, email, cleanedMobile, passwordHash);
      const user = { id, name, email, mobile: cleanedMobile, role: UserRole.CUSTOMER };
      const token = this.generateToken(user);
      return { user, token };
    } catch (dbError: any) {
      if (dbError instanceof ConflictError) throw dbError;

      // Offline dev mode fallback
      if (devUsers.has(email.toLowerCase()) || devUsers.has(cleanedMobile)) {
        throw new ConflictError('An account with this email or mobile already exists');
      }

      const id = (1000 + devUsers.size + 1).toString();
      const newUser = { id, name, email: email.toLowerCase(), mobile: cleanedMobile, role: UserRole.CUSTOMER };
      const stored = { ...newUser, passwordHash };
      devUsers.set(email.toLowerCase(), stored);
      devUsers.set(cleanedMobile, stored);

      const token = this.generateToken(newUser);
      return { user: newUser, token };
    }
  }

  async loginCustomer(identifier: string, password: string): Promise<AuthPayload> {
    const passwordHash = this.hashPassword(password);
    const cleanId = identifier.trim().toLowerCase();
    const cleanMobile = identifier.replace(/[^0-9]/g, '').slice(-10);

    try {
      let user = await authRepository.getCustomerByEmail(cleanId);
      if (user && user.passwordHash === passwordHash) {
        const { passwordHash: _, ...userWithoutHash } = user;
        const token = this.generateToken(userWithoutHash);
        return { user: userWithoutHash, token };
      }
    } catch {
      // Fall through to dev memory store
    }

    // Check dev user registry by email or mobile
    const devUser = devUsers.get(cleanId) || (cleanMobile.length === 10 ? devUsers.get(cleanMobile) : null);
    if (!devUser || devUser.passwordHash !== passwordHash) {
      throw new UnauthorizedError('Invalid credentials. Check your email/mobile and password.');
    }

    const { passwordHash: _, ...userWithoutHash } = devUser;
    const token = this.generateToken(userWithoutHash);
    return { user: userWithoutHash, token };
  }

  async getMe(id: string): Promise<Customer | null> {
    try {
      return await authRepository.getCustomerById(id);
    } catch {
      for (const u of devUsers.values()) {
        if (u.id === id) {
          const { passwordHash: _, ...rest } = u;
          return rest;
        }
      }
      return null;
    }
  }
}

export const authService = new AuthService();
