import React, { Component, PropTypes } from 'react';
import PlaylistItem from '../../components/PlaylistItem/PlaylistItem';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';
import _ from 'underscore';
import Infinite from 'react-infinite';

class PlaylistListView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.mounted = false;
  }

  componentDidMount() {
    if (window) {
      this.setState({
        mounted: true
      });
    }
  }

  render() {
    if (this.state.mounted) {
      return (
        <div>
          <h2 className="page-header discover-header">Latest Festival Playlists</h2>
          <div className="listView">
            <Infinite containerHeight={621} elementHeight={207} useWindowAsScrollContainer>
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
    } else {
      return (<div></div>)
    }
  }
}

PlaylistListView.contextTypes = {
  router: React.PropTypes.object,
};

PlaylistListView.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(PlaylistListView);
