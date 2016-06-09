import * as PlaylistController from '../controllers/playlist.controller';

const routePlaylists = (router) => {
  router.route('/playlists').get(PlaylistController.generatePlaylist);
};

export default routePlaylists;
