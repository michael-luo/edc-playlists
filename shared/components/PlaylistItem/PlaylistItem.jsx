import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function PlaylistItem(props) {
  let playlistId;
  let playlistName;
  let playlistOwnerId;
  let numTracks;
  let href;

  if (props.playlist.createdPlaylist) {
    playlistId = props.playlist.playlistDbId;
    playlistName = props.playlist.createdPlaylist.playlist.name;
    playlistOwnerId = props.playlist.createdPlaylist.playlist.owner.id;
    numTracks = props.playlist.createdPlaylist.tracks.length;
    href = props.playlist.createdPlaylist.playlist.external_urls.spotify;
  } else {
    playlistId = props.playlist._id;
    playlistName = props.playlist.name;
    playlistOwnerId = props.playlist.ownerId;
    numTracks = props.playlist.tracks.length;
    href = props.playlist.href;
  }

  if (numTracks > 0) {
    numTracks = numTracks + ' tracks';
  } else {
    numTracks = numTracks + ' track';
  }

  return (
    <div className="single-post">
      <h3 className="post-title ">
        <Link to={`/playlists/${playlistId}`} onClick={props.onClick}>
          {playlistName}
        </Link>
      </h3>
      <p className="author-name">By {playlistOwnerId}</p>
      <p className="post-desc">{numTracks}</p>
      <p className="post-action"><a href={href}><strong>Play on Spotify</strong></a></p>
      <hr className="divider"/>
    </div>
  );
}

PlaylistItem.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default PlaylistItem;
