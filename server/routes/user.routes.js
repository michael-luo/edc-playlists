import * as UserController from '../controllers/user.controller';

const routeUsers = (router) => {
  // Get the currently authenticated user
  router.route('/user/self').get(UserController.self);
};

export default routeUsers;
