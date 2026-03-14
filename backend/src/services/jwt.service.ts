import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { config } from '../config';

export type JwtPayload = {
  sub: string;
  role: Role;
};

export const signToken = (userId: string, role: Role) =>
  jwt.sign({ role }, config.jwtSecret, {
    subject: userId,
    expiresIn: config.jwtExpiresIn
  });

export const verifyToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
  if (!payload.sub || !payload.role) {
    throw new Error('Invalid token payload');
  }
  return { sub: payload.sub, role: payload.role as Role };
};
