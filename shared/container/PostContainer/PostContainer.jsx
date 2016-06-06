import React, { PropTypes, Component } from 'react';
import PostListView from '../PostListView/PostListView';
import PostCreateView from '../../components/PostCreateView/PostCreateView';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';

class PostContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showAddPost: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.add = this.add.bind(this);
    this.props.dispatch(Actions.fetchAuthenticatedUser());
  }

  handleClick(e) {
    this.setState({
      showAddPost: !this.state.showAddPost,
    });

    e.preventDefault();
  }

  add(name, title, content) {
    this.props.dispatch(Actions.addPostRequest({ name, title, content }));
    this.setState({
      showAddPost: false,
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
        <Header onClick={this.handleClick} user={this.props.user}/>
        <div className="container">
          <PostCreateView addPost={this.add}
            showAddPost={this.state.showAddPost}/>
          <PostListView posts={this.props.posts}/>
        </div>
        <Footer />
      </div>
    );
  }
}

PostContainer.needs = [
  () => { return Actions.fetchPosts(); },
  () => { return Actions.fetchAuthenticatedUser(); }
];

PostContainer.contextTypes = {
  router: React.PropTypes.object,
};

function mapStateToProps(store) {
  return {
    posts: store.data.posts,
    user: store.user
  };
}

PostContainer.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(PostContainer);
