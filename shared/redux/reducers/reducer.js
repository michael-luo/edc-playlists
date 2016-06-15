import * as ActionTypes from '../constants/constants';
import { combineReducers } from 'redux';

const postsInitialState = { posts: [], post: null };

const data = (state = postsInitialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_POST:
      return {
        posts: [{
          name: action.name,
          title: action.title,
          content: action.content,
          slug: action.slug,
          cuid: action.cuid,
          _id: action._id,
        }, ...state.posts],
        post: state.post };

    case ActionTypes.CHANGE_SELECTED_POST:
      return {
        posts: state.posts,
        post: action.slug,
      };

    case ActionTypes.ADD_POSTS :
      return {
        posts: action.posts,
        post: state.post,
      };

    case ActionTypes.ADD_SELECTED_POST:
      return {
        post: action.post,
        posts: state.posts,
      };

    case ActionTypes.DELETE_POST:
      return {
        posts: state.posts.filter((post) => post._id !== action.post._id),
      };

    default:
      return state;
  }
};

const user = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SET_AUTHENTICATED_USER:
      return action.user;
    default:
      return state;
  }
};

const events = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_EVENTS:
      return action.events;
    default:
      return state;
  }
};

const playlistInitialState = { playlists: [], playlist: null };

const playlist = (state = playlistInitialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_PLAYLIST:
      return {
        playlists: [action.playlist, ...state.playlists],
        playlist: state.playlist
      };
    case ActionTypes.ADD_PLAYLISTS:
      return {
        playlists: action.playlists,
        playlist: state.playlist
      };
    case ActionTypes.ADD_SELECTED_PLAYLIST:
      return action.playlist;
    default:
      return state;
  }
}

const musicApp = combineReducers({
  data,
  user,
  events,
  playlist,
});

export default musicApp;
