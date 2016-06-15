import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import MusicContainer from './container/MusicContainer/MusicContainer';
import PlaylistDetailView from './container/PlaylistDetailView/PlaylistDetailView';
import Error from './components/Error/Error';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={MusicContainer} />
    <Route path="/playlists/:playlistId" component={PlaylistDetailView} />
    <Route path="/error/:errorMsg" component={Error} />
  </Route>
);

export default routes;
