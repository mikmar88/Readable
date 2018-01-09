import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PostInfo from './PostInfo'
import PostEdit from './PostEdit'
import PostComments from './PostComments'
import { fetchPost, fetchDeletePost, votePost, getPost, openPostDialog } from '../actions/post'
import { openCommentDialog } from '../actions/comment'
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Toolbar, ToolbarGroup, RaisedButton, FloatingActionButton, CircularProgress } from 'material-ui';

class PostDetail extends Component {

  componentDidMount() {
    const { match, loadPost } = this.props
	loadPost(match.params.id)
  }
  
  componentWillUnmount() {
  	const { resetCurrentPost } = this.props
    resetCurrentPost()
  }

  // delete post
  deleteAction() {
  	const { deletePost, currentPost, history } = this.props
	deletePost(currentPost.id)
	history.goBack()
  }
  
  // edit post
  editAction() {
  	const { openEditPost, currentPost } = this.props
    openEditPost(currentPost)
  }

  render() {
    const { history, currentPost, openEditComment, openPostDialog } = this.props
 	const addCommentButtonStyle = { position: 'fixed', bottom: '32px', right: '32px' }
    
    return (
      <div>
      	{currentPost && currentPost.id === undefined && (
         <div>
         	<h4>Sorry but this post is no longer available</h4>
         	<RaisedButton label="Back" onClick={() => history.goBack() } />
         </div>
         )}
       	{ currentPost && currentPost.deleted === false && (
         	<div>
         	  <Toolbar>
         		<ToolbarGroup firstChild={true}>
      				<RaisedButton label='back' icon={<KeyboardArrowLeft />} onClick={() => history.goBack() }/>
      			</ToolbarGroup>
         	  </Toolbar>
              <PostInfo post={currentPost} />
			  <PostComments />
			  <FloatingActionButton 
				title="Add new comment" 
				style={addCommentButtonStyle} 
				onClick={() => openEditComment()}>
					<ContentAdd />
			  </FloatingActionButton>
     		</div>
      	)}
		{ openPostDialog === true && (<PostEdit /> )}
		{ !currentPost &&
          <div className="appLoading">
          	<CircularProgress />
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps({ posts, comments }) {
  return { currentPost: posts.currentPost, 
           comments: comments,
           openPostDialog: posts.open 
         }
}

function mapDispatchToProps(dispatch) {
	return {
      loadPost: (id) => dispatch(fetchPost(id)),
      vote: (vote, id) => dispatch(votePost(vote, id)),
      deletePost: (id) => dispatch(fetchDeletePost(id)),
      openEditComment: () => dispatch(openCommentDialog(null, true)),
      resetCurrentPost: () => dispatch(getPost(null)),
      openEditPost: (post) => dispatch(openPostDialog(post, true))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostDetail))