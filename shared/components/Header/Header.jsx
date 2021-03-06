import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class Header extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const vis = (this.props.hideLogin) ? 'hidden' : 'visible';
    return (
      <div className="header">
        <div className="header-content">
          <span className="site-title">
            <Link to="/" onClick={this.props.handleLogoClick}>
              <img className="header-logo" src="/img/header-logo-white.png"/>
            </Link>
          </span>
          {
            this.context.router.isActive('/', true)
              ? <span className="add-post-button" href="#" onClick={this.props.onClick}>Generate Playlist</span>
              : null
          }
          {
            this.props.user && this.props.user.spotify && this.props.user.name
              ? <div className="display-name">{this.props.user.name}</div>
              : <a style={{visibility: vis}} href="/api/auth/spotify" className="sign-in">Sign In</a>
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
