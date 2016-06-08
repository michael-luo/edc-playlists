import * as EventController from '../controllers/event.controller';

const routeEvents = (router) => {
  // Get the currently authenticated user
  router.route('/events').get(EventController.getEvents);
};

export default routeEvents;
