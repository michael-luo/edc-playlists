import * as ActionTypes from '../constants/constants';
import { ENABLE_SEND_SESSION } from '../constants/constants';
import Config from '../../../server/config';
import fetch from 'isomorphic-fetch';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${Config.port}`) : '';

export function addPost(post) {
  return {
    type: ActionTypes.ADD_POST,
    name: post.name,
    title: post.title,
    content: post.content,
    slug: post.slug,
    cuid: post.cuid,
    _id: post._id,
  };
}

export function changeSelectedPost(slug) {
  return {
    type: ActionTypes.CHANGE_SELECTED_POST,
    slug,
  };
}

export function addPostRequest(post) {
  return (dispatch) => {
    fetch(`${baseURL}/api/addPost`, {
      method: 'post',
      body: JSON.stringify({
        post: {
          name: post.name,
          title: post.title,
          content: post.content,
        },
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then(res => dispatch(addPost(res.post)));
  };
}

export function addSelectedPost(post) {
  return {
    type: ActionTypes.ADD_SELECTED_POST,
    post,
  };
}

export function getPostRequest(post) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/getPost?slug=${post}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json()).then(res => dispatch(addSelectedPost(res.post)));
  };
}

export function addSelectedPlaylist(playlist) {
  return {
    type: ActionTypes.ADD_SELECTED_PLAYLIST,
    playlist,
  };
}

export function getPlaylistRequest(playlistId) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/playlists/${playlistId}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      credentials: 'include',
    }).then((response) => response.json()).then(res => {
      dispatch(addSelectedPlaylist(res.data))
    });
  };
}

export function addPlaylists(playlists) {
  return {
    type: ActionTypes.ADD_PLAYLISTS,
    playlists
  }
}

export function fetchPlaylists() {
  return (dispatch) => {
    return fetch(`${baseURL}/api/playlists`)
      .then((response) => response.json())
      .then((response) => dispatch(addPlaylists(response.data)));
  }
}

export function deletePost(post) {
  return {
    type: ActionTypes.DELETE_POST,
    post,
  };
}

export function addPosts(posts) {
  return {
    type: ActionTypes.ADD_POSTS,
    posts,
  };
}

export function fetchPosts() {
  return (dispatch) => {
    return fetch(`${baseURL}/api/getPosts`).
      then((response) => response.json()).
      then((response) => dispatch(addPosts(response.posts)));
  };
}

export function deletePostRequest(post) {
  return (dispatch) => {
    fetch(`${baseURL}/api/deletePost`, {
      method: 'post',
      body: JSON.stringify({
        postId: post._id,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(() => dispatch(deletePost(post)));
  };
}

export function setAuthenticatedUser(user) {
  return {
    type: ActionTypes.SET_AUTHENTICATED_USER,
    user
  };
}

export function fetchAuthenticatedUser() {
  return (dispatch) => {
    return fetch(`${baseURL}/api/user/self`, ENABLE_SEND_SESSION)
      .then((response) => response.json())
      .then((response) => dispatch(setAuthenticatedUser(response.data)));
  };
}

export function addEvents(events) {
  return {
    type: ActionTypes.ADD_EVENTS,
    events
  };
}

export function fetchMusicEvents() {
  return (dispatch) => {
    return fetch(`${baseURL}/api/events`)
      .then((response) => response.json())
      .then((response) => dispatch(addEvents(response.data)));
  }
}

export function createPlaylist(title, artists, eventId) {
  if (!title || title === '' || !artists || artists.length === 0 || !eventId) {
    return (dispatch) => {
      console.log('invalid playlist params');
      dispatch({ type: 'FAILED_CREATE_PLAYLIST' });
    }
  }

  // Build artist IDs from artists objects
  let artistIds = [];
  for (const artist of artists) {
    artistIds.push(artist.id);
  }

  return (dispatch) => {
    fetch(`${baseURL}/api/playlists`, {
      method: 'post',
      body: JSON.stringify({
        artists: artistIds,
        playlistName: title,
        eventId,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      credentials: 'include',
    })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      dispatch(addPlaylist(res.data))
    })
    .catch((err) => {
      console.error(err);
    });
  };
}

export function addPlaylist(playlist) {
  return {
    type: ActionTypes.ADD_PLAYLIST,
    playlist,
  };
}
