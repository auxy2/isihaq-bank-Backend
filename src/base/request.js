import { createValidator } from 'express-joi-validation';

export const validator = createValidator();

export const openRoutes = [
  { method: 'GET', path: '/' },
  { method: 'GET', path: '/api' },
];
