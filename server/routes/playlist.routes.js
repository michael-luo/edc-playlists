import * as PlaylistController from '../controllers/playlist.controller';
import * as AuthUtil from '../util/auth';

const routePlaylists = (router) => {
  router.route('/playlists').post(AuthUtil.ensureAuthenticated, PlaylistController.generatePlaylist);
  router.route('/playlists').get(PlaylistController.getPlaylists);
  router.route('/playlists/:playlistId').get(PlaylistController.getPlaylist);
};

export default routePlaylists;
