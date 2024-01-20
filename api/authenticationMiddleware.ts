import { Request, Response, NextFunction } from 'express';
import {
  createKindeServerClient,
  GrantType,
  SessionManager,
} from '@kinde-oss/kinde-typescript-sdk';

const clientOptions = {
  authDomain: 'https://sjoef.kinde.com',
  clientId: '8ccaa8a0f3c64ff5ab93e5796186c255',
  clientSecret: 'GCx0nSoosFvsOQx8oD9tuOerdGvdBigCbx6tSIHKwn6TsxqJtxiy',
  logoutRedirectURL: 'http://localhost:3000/login',
  redirectURL: 'http://localhost:3000/home',
  audience: 'https://localhost:3000/api',
  scope: 'profile email openid offline_access permissions',
};

let store: Record<string, unknown> = {};

const sessionManager: SessionManager = {
  async getSessionItem(key: string) {
    return store[key];
  },
  async setSessionItem(key: string, value: unknown) {
    store[key] = value;
  },
  async removeSessionItem(key: string) {
    delete store[key];
  },
  async destroySession() {
    store = {};
  },
};

const kindeServerClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, clientOptions);

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.originalUrl === '/api/webhook') {
      return next();
    }
    const token = req.headers.authorization?.split(' ')[1]; // Assuming token is sent as a Bearer token
    if (!token) {
      return res.status(401).send('Access token is required');
    }

    await sessionManager.setSessionItem('access_token', token);
    await kindeServerClient.getToken(sessionManager);

    const isAuthenticated = await kindeServerClient.isAuthenticated(sessionManager);
    if (!isAuthenticated) {
      return res.status(403).send('Invalid or expired token');
    }
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
}

export async function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming token is sent as a Bearer token
    if (!token) {
      return res.status(401).send('Access token is required');
    }

    const { permissions } = await kindeServerClient.getPermissions(sessionManager);
    if (!permissions?.includes('admin')) {
      return res.status(403).send('User is not authorized');
    }

    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
}
