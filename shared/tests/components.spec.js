import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import PostListItem from '../components/PostListItem/PostListItem';
import PostCreateView from '../components/PostCreateView/PostCreateView';
import React from 'react';
import expectJSX from 'expect-jsx';
import { Link } from 'react-router';

expect.extend(expectJSX);

describe('component tests', () => {
  it('should render PostListItem properly', () => {
    const renderer = TestUtils.createRenderer();
    const post = {
      name: 'Prank',
      title: 'first post',
      content: 'hello world!',
      slug: 'first-post',
      cuid: 'cikpdcdn60000zjxom3dmavzq',
    };
    renderer.render(
      <PostListItem
        post={post}
        onClick={function click() {}}

        onDelete={function noop() {}}

      />
    );
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(
      <div className="single-post">
        <h3 className="post-title ">
          <Link to={`/post/${post.slug}-${post.cuid}`} onClick={function noop() {}}>
            {post.title}
          </Link>
        </h3>
        <p className="author-name">By {post.name}</p>
        <p className="post-desc">{post.content}</p>
        <p className="post-action"><a href="#" onClick={function noop() {}}>Delete Playlist</a></p>
        <hr className="divider"/>
      </div>
    );
  });

  it('should render PostCreateView properly', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<PostCreateView showAddPost={false} addPost={function noop() {}}/>);

    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(
      <div className="form ">
        <div className="form-content">
          <h2 className="form-title">Create New Playlist</h2>
          <input placeholder="Artist's Name" className="form-field" ref="name"/>
          <input placeholder="Playlist Title" className="form-field" ref="title"/>
          <textarea placeholder="Playlist Tracks" className="form-field" ref="content"></textarea>
          <a className="post-submit-button align-right" href="#" onClick={function noop() {}}>Submit</a>
        </div>
      </div>
    );
  });

  it('should show post create form in PostCreateView if showAddPost is true', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<PostCreateView showAddPost addPost={function noop() {}}/>);

    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(
      <div className="form appear">
        <div className="form-content">
          <h2 className="form-title">Create New Playlist</h2>
          <input placeholder="Artist's Name" className="form-field" ref="name"/>
          <input placeholder="Playlist Title" className="form-field" ref="title"/>
          <textarea placeholder="Playlist Tracks" className="form-field" ref="content"></textarea>
          <a className="post-submit-button align-right" href="#" onClick={function noop() {}}>Submit</a>
        </div>
      </div>
    );
  });
});
