import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import _ from 'underscore';

class PlaylistCreateView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

    const events = props.events;
    if (events && events.length > 0 && events[0].ref && events[0].year) {
      this.state.defaultEvent = events[0].ref.toLowerCase() + events[0].year;
    } else {
      this.state.defaultEvent = '';
    }

    this.addPost = this.addPost.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  addPost() {
    const nameRef = this.refs.name;
    const titleRef = this.refs.title;
    const contentRef = this.refs.content;
    if (nameRef.value && titleRef.value && contentRef.value) {
      this.props.addPost(nameRef.value, titleRef.value, contentRef.value);
      nameRef.value = titleRef.value = contentRef.value = '';
    }
  }

  onSelectChange(val) {
    this.setState({ defaultEvent: val });
  }

  getSelectEventOptions() {
    const events = this.props.events;

    if (!events || events.length === 0) {
      return [];
    }

    return _.map(events, (event) => {
      return {
        value: (event.ref.toLowerCase() + event.year),
        label: `${event.name} ${event.year}`,
      };
    });
  }

  render() {
    return (
      <div className='form appear'>
        <div className="form-content">
          <h2 className="form-title">Create New Playlist</h2>
          <Select name="event-name" value={this.state.defaultEvent}
            options={this.getSelectEventOptions()} onChange={this.onSelectChange}/>
          <input placeholder="Artist's Name" className="form-field" ref="name"/>
          <input placeholder="Playlist Title" className="form-field" ref="title"/>
          <textarea placeholder="Playlist Tracks" className="form-field" ref="content"></textarea>
          <a className="post-submit-button align-right" href="#" onClick={this.addPost}>Submit</a>
        </div>
      </div>
    );
  }
}

PlaylistCreateView.propTypes = {
  addPost: PropTypes.func.isRequired,
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
