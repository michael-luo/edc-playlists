import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Helmet from 'react-helmet';

class PlaylistDetailView extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.handleLogoClick = this.handleLogoClick.bind(this);
  }

  handleClick() {
    this.setState({
      showAddPost: true,
    });
  }

  handleLogoClick() {
    this.props.dispatch(Actions.fetchPosts());
  }

  render() {
    return (
      <div>
        <Helmet title={this.props.post.title} />

        <Header onClick={function noop() {}} handleLogoClick={this.handleLogoClick}
          user={this.props.user}/>
        <div className="container">
          <div className="single-post post-detail">
            <h3 className="post-title">{this.props.post.title}</h3>
            <p className="author-name">By {this.props.post.name}</p>
            <p className="post-desc">{this.props.post.content}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

PlaylistDetailView.need = [(params) => {
  return Actions.getPostRequest.bind(null, params.slug)();
}];

PlaylistDetailView.contextTypes = {
  router: React.PropTypes.object,
};

PlaylistDetailView.propTypes = {
  post: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(store) {
  return {
    post: store.data.post,
    user: store.user
  };
}

export default connect(mapStateToProps)(PlaylistDetailView);