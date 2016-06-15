import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Helmet from 'react-helmet';

class PlaylistDetailView extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleLogoClick = this.handleLogoClick.bind(this);
  }

  handleLogoClick() {
    this.props.dispatch(Actions.fetchPlaylists());
    this.context.router.push('/');
  }

  render() {
    return (
      <div>
        <Helmet title={this.props.playlist.name} />

        <Header onClick={function noop() {}} handleLogoClick={this.handleLogoClick}
          user={this.props.user} hideLogin={true}/>
        <div className="container">
          <div className="single-post post-detail">
            <h3 className="post-title">{this.props.playlist.name}</h3>
            <p className="author-name">By {this.props.playlist.ownerId}</p>
            <p className="post-desc">{''}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

PlaylistDetailView.need = [(params) => {
  return Actions.getPlaylistRequest.bind(null, params.playlistId)();
}];

PlaylistDetailView.contextTypes = {
  router: React.PropTypes.object,
};

PlaylistDetailView.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(store) {
  return {
    playlist: store.playlist,
    user: store.user
  };
}

export default connect(mapStateToProps)(PlaylistDetailView);
