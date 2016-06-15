import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { WithContext as ReactTags } from 'react-tag-input';
import InputRange from 'react-input-range';
import _ from 'underscore';

function _getFormattedEventName(event) {
  return `${event.ref} ${event.year}`;
}

function _getArtistRows(events, _id) {
  let artists = [];
  if (!events || !_.isArray(events) || _.isEmpty(events)) {
    return artists;
  }
  // Default to first event's artists if target not specified
  if (!_id) {
    return _getFormattedArtists(events[0].artists);
  }

  for (const event of events) {
    if (event._id === _id) {
      return _getFormattedArtists(event.artists);
    }
  }

  return [];
}

function _getFormattedArtists(artists) {
  return _.map(artists, (artist) => {
    return {
      id: artist.id,
      artist: artist.name,
      genres: artist.genres.sort().join(', '),
    };
  });
}

const selectArtistRowProp = (onSelect) => {
  return {
    mode: 'checkbox',
    clickToSelect: true,
    bgColor: 'rgb(52, 152, 219)',
    onSelect,
  };
};

class PlaylistCreateView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

    const events = props.events;
    if (events && events.length > 0) {
      this.state.currentEvent = events[0]._id;
    } else {
      this.state.currentEvent = '';
    }

    this.state.artistRows = _getArtistRows(this.props.events);
    this.state.selectedArtists = [];

    this.createPlaylist = this.createPlaylist.bind(this);
    this.onEventSelectChange = this.onEventSelectChange.bind(this);
    this.onArtistRowSelect = this.onArtistRowSelect.bind(this);
  }

  createPlaylist() {
    if (_.isEmpty(this.props.user)) {
      window.location.href= '/api/auth/spotify';
    }

    const titleRef = this.refs.playlistTitle;
    this.props.createPlaylist(titleRef.value, this.state.selectedArtists, this.state.currentEvent);
    this.state.selectedArtists = [];
  }

  onEventSelectChange(val) {
    this.setState({
      currentEvent: val.value,
      artistRows: _getArtistRows(this.props.events, val.value),
    });
  }

  getEventSelectOptions() {
    const events = this.props.events;

    if (!events || events.length === 0) {
      return [];
    }

    return _.map(events, (event) => {
      return {
        value: event._id,
        label: `${event.name} ${event.year}`,
      };
    });
  }

  onArtistRowSelect(row, isSelected) {
    if (isSelected) {
      this.setState({
        selectedArtists: [
          ...this.state.selectedArtists,
          {
            id: row.id,
            text: row.artist,
          }
        ],
      });
    } else {
      this.setState({
        selectedArtists: _.filter(this.state.selectedArtists, (artist) => artist.id !== row.id),
      });
    }
  }

  render() {
    return (
      <div>
        {this.props.history}
        <div className='form appear'>
          <div className="form-content">
            <h2 className="form-title">Create New Playlist</h2>

            <Select
              name="event-name"
              value={this.state.currentEvent}
              options={this.getEventSelectOptions()}
              onChange={this.onEventSelectChange}/>

            <BootstrapTable
              data={this.state.artistRows}
              striped={true}
              hover={true}
              search={true}
              multiColumnSearch={true}
              searchPlaceholder="Search all artists and genres"
              selectRow={selectArtistRowProp(this.onArtistRowSelect)}
              >
              <TableHeaderColumn
                hidden={true}
                dataField="id"
                isKey={true}>
                ID
              </TableHeaderColumn>

              <TableHeaderColumn
                dataField="artist"
                dataSort={true}>
                Artist
              </TableHeaderColumn>

              <TableHeaderColumn
                dataField="genres"
                dataSort={true}>
                Genres
              </TableHeaderColumn>
            </BootstrapTable>

            <ReactTags
              tags={this.state.selectedArtists}
              readOnly={true}
              handleDelete={() => {}}
              handleAddition={() => {}}
            />

            <input defaultValue={_getFormattedEventName(this.props.events[0])} placeholder="Name Your Playlist" className="form-control form-field" ref="playlistTitle"/>
            <a className="post-submit-button align-right" href="#" onClick={this.createPlaylist}>Generate</a>
          </div>
        </div>
      </div>
    );
  }
}

PlaylistCreateView.propTypes = {
  createPlaylist: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    days: PropTypes.number.isRequired,
    ref: PropTypes.string.isRequired,
    artists: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
};

export default PlaylistCreateView;
