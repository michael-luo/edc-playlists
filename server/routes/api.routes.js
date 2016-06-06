import { Router } from 'express';
// Import all the routes
import post from './post.routes';
import user from './user.routes';
import auth from './auth.routes';

export default function router(passport) {
  const router = new Router();
  const routes = [post, user];

  // Register all the API routes
  for (const applyRoute of routes) {
    applyRoute(router);
  }

  // Register the auth route
  auth(router, passport);

  return router;
}
