import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class Header extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="header">
        <div className="header-content">
          <h1 className="site-title">
            <Link to="/" onClick={this.props.handleLogoClick}>Discover</Link>
          </h1>
          {
            this.context.router.isActive('/', true)
              ? <a className="add-post-button" href="#" onClick={this.props.onClick}>+ Playlist</a>
              : null
          }
          {
            this.props.user && this.props.user.spotify && this.props.user.name
              ? <div className="display-name">Michael Luo</div>
              : <a href="/api/auth/spotify" className="sign-in">Sign In</a>
          }

        </div>
      </div>
    );
  }
}

Header.contextTypes = {
  router: React.PropTypes.object,
};

Header.propTypes = {
  user: PropTypes.shape({
    spotify: PropTypes.shape({
      id: PropTypes.string
    }),
    name: PropTypes.string
  }),
  onClick: PropTypes.func.isRequired,
  handleLogoClick: PropTypes.func,
};

export default Header;
