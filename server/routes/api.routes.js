import { Router } from 'express';
// Import all the routes
import auth from './auth.routes';
import event from './event.routes';
import playlist from './playlist.routes';
import post from './post.routes';
import user from './user.routes';

// Handler function for configuring all the routes used by this application
export default function router(passport) {
  const router = new Router();

  // Add route objects here
  const routes = [event, playlist, post, user];

  // Register all the API routes
  for (const applyRoute of routes) {
    applyRoute(router);
  }

  // Register the auth route differently
  auth(router, passport);

  return router;
}
