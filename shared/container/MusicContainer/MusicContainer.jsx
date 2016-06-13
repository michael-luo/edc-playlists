import React, { PropTypes, Component } from 'react';
import PlaylistListView from '../PlaylistListView/PlaylistListView';
import PlaylistCreateView from '../../components/PlaylistCreateView/PlaylistCreateView';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';

const RECENT_PLAYLISTS = 'recentPlaylists';
const CREATE_PLAYLIST = 'createPlaylist';

class MusicContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentView: RECENT_PLAYLISTS
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleLogoClick = this.handleLogoClick.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.props.dispatch(Actions.fetchAuthenticatedUser());
    this.props.dispatch(Actions.fetchMusicEvents());
  }

  handleClick(e) {
    switch (this.state.currentView) {
      case RECENT_PLAYLISTS:
        this.setState({
          currentView: CREATE_PLAYLIST,
        });
        break;
      case CREATE_PLAYLIST:
        this.setState({
          currentView: RECENT_PLAYLISTS,
        });
        break;
    }

    e.preventDefault();
  }

  handleLogoClick() {
    this.setState({
      currentView: RECENT_PLAYLISTS,
    });
  }

  createPlaylist(title, artists) {
    this.props.dispatch(Actions.createPlaylist(title, artists));
    this.setState({
      currentView: RECENT_PLAYLISTS,
    });
  }

  componentDidMount() {
    if(this.props.posts.length === 0) {
      this.props.dispatch(Actions.fetchPosts());
    }
  }

  render() {
    return (
      <div>
        <Header onClick={this.handleClick} handleLogoClick={this.handleLogoClick}
          user={this.props.user}/>
        <div className="container">
          {
            this.state.currentView === CREATE_PLAYLIST
            ? <PlaylistCreateView createPlaylist={this.createPlaylist} events={this.props.events}/>
            : null
          }
          {
            this.state.currentView === RECENT_PLAYLISTS
            ? <PlaylistListView posts={this.props.posts}/>
            : null
          }
        </div>
        <Footer />
      </div>
    );
  }
}

MusicContainer.needs = [
  () => { return Actions.fetchPosts(); }
];

MusicContainer.contextTypes = {
  router: React.PropTypes.object,
};

function mapStateToProps(store) {
  return {
    posts: store.data.posts,
    user: store.user,
    events: store.events,
  };
}

MusicContainer.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(MusicContainer);