import React, { Component } from 'react';
import Footer from '../Footer/Footer';

export default class Error extends Component {
  render() {
    return (
      <div className="error">
        <h2>An Error Occurred</h2>
        <p>{this.props.params.errorMsg}</p>
      </div>
    );
  }
}
