import React, { Component, PropTypes } from 'react';
import PlaylistItem from '../../components/PlaylistItem/PlaylistItem';
import { connect } from 'react-redux';
import Infinite from 'react-infinite';
import * as Actions from '../../redux/actions/actions';
import _ from 'underscore';

class PlaylistListView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.height = 440;
  }

  componentDidMount() {
    if (window) {
      this.setState({
        height: window.innerHeight
      });
    }
  }

  render() {
    return (
      <div>
        <h2 className="page-header discover-header">Latest Festival Playlists</h2>
        <div className="listView">
          <Infinite containerHeight={this.state.height} elementHeight={40}>
            {
              _.map(this.props.playlists, (playlist, i) => {
                return (
                <PlaylistItem playlist={playlist} key={i}
                  onClick={function handleClick() {
                    this.props.dispatch(Actions.addSelectedPlaylist(playlist));
                  }}
                />
              )})
            }
          </Infinite>
        </div>
      </div>
    );
  }
}

PlaylistListView.contextTypes = {
  router: React.PropTypes.object,
};

PlaylistListView.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(PlaylistListView);
