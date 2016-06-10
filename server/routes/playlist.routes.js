import * as PlaylistController from '../controllers/playlist.controller';
import * as AuthUtil from '../util/auth';

const routePlaylists = (router) => {
  router.route('/playlists').get(AuthUtil.ensureAuthenticated, PlaylistController.generatePlaylist);
};

export default routePlaylists;
