import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Timestamp from 'react-timestamp'
import { votePost, fetchPosts, fetchDeletePost, openPostDialog } from '../actions/post'
import { fetchPostComments } from '../actions/comment'

import {Badge, Card, CardText, CardTitle, CardActions, Chip, IconButton } from 'material-ui';
import Comment from 'material-ui/svg-icons/communication/comment';
import Star from 'material-ui/svg-icons/toggle/star'
import ThumbDown from 'material-ui/svg-icons/action/thumb-down'
import ThumbUp from 'material-ui/svg-icons/action/thumb-up'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import Delete from 'material-ui/svg-icons/action/delete'
import { yellow500, blue300, grey400 } from 'material-ui/styles/colors';


class Post extends Component {
  
  componentDidMount() {
    const { loadComments, post } = this.props
    loadComments(post.id)
  }
  
  componentWillReceiveProps(nextProps) {
    // when change the post id i have to reload the post data
    const { loadComments, post } = this.props
  	if (post.id !== nextProps.post.id) {
      loadComments(post.id)
    }
  }
  
  // execute the delete action
  deleteAction(){
    const { deletePost, post, reloadPosts, categories } = this.props
    const currentCategory = categories.currentCategory.name ? categories.currentCategory.name : ''
    Promise.resolve()
    .then(() => deletePost(post.id))
    .then(() => reloadPosts(currentCategory))
  }
  
  // execute the edit action
  editAction() {
    const { openEditPost, post} = this.props
    openEditPost(post)
  }
  
  // execute the vote action
  onVote(value, id) {
  	const { vote, reloadPosts, categories } = this.props
    const currentCategory = categories.currentCategory.name ? categories.currentCategory.name : ''
    Promise.resolve()
    .then(() => vote(value, id))
    .then(() => reloadPosts(currentCategory))
    
  }

  render() {
    const { comments, post, match } = this.props
    const chipCategoryStyle = { display: 'inline-block'}
    const iconsStyle = { height: 18, width: 18 }
    let postComments
    let postTitle = post && (!match.params.category && !match.params.id) ?  <Link to={`/${post.category}/${post.id}`}>{post.title}</Link> : <span>{post.title}</span>
	if (comments && comments.items && comments.items.length > 0 ) {
		postComments = comments.items.filter( (comment) => comment.parentId === post.id)
	}

    return (
		<div>
		{ post && 
		        <Card>
                  <CardTitle title={postTitle} >
      				  <div className="rightButtons">
                        <IconButton iconStyle={iconsStyle} children={<ModeEdit color={grey400} />} onClick={() => this.editAction() } />
                        <IconButton iconStyle={iconsStyle} children={<Delete color={grey400} />} onClick={() => this.deleteAction() } />
                    </div>
                    <span className="postInfo">created <Timestamp time={post.timestamp/1000} /> by {post.author} <Chip style={chipCategoryStyle}>{post.category}</Chip></span>
                  </CardTitle>

                  <CardText>{post.body}</CardText>
                  <CardActions>
                    <IconButton children={ <ThumbDown />} onClick={() => this.onVote('downVote', post.id)}/>
					<IconButton children={ <ThumbUp />} onClick={() => this.onVote('upVote', post.id) }/>
					<Badge badgeContent={post.voteScore} primary={true}>
						<Star color={yellow500} />
					</Badge>
					<Badge badgeContent={postComments  && postComments.length > 0 ? postComments.length : 0} secondary={true}>
						<Comment color={blue300} />
					</Badge>
                  </CardActions>
              </Card>
		}
		</div>
    )
  }
  
}

function mapStateToProps({ comments, categories }) {
	return { comments, categories }
}

function mapDispatchToProps(dispatch) {
  return {
  	vote: (vote, id) => dispatch(votePost(vote, id)),
    reloadPosts: (category) => dispatch(fetchPosts(category)),
	loadComments: (id) => dispatch(fetchPostComments(id)),
    deletePost: (id) => dispatch(fetchDeletePost(id)),
    openEditPost: (post) => dispatch(openPostDialog(post, true))
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Post))