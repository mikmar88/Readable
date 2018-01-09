import React, { Component } from 'react'
import { connect } from 'react-redux'
import serializeForm from 'form-serialize'
import { openCommentDialog, addComment, updateComment, fetchPostComments, initializePostComments } from '../actions/comment'

import { Dialog, RaisedButton, TextField } from 'material-ui';
import uuid  from 'uuid'

class CommentEditItem extends Component {
  
  // handle the form submit
  handleSubmit = (e) => {
    if (!e) 
      return;
    
    e.preventDefault()
    const { currentComment, add, update, reloadPostComments, resetPostComments } = this.props
    
    // serialize the form values
    const values = serializeForm(e.target, { hash: true })
    
    if (values.parentId && values.parentId.length > 0 ) {
    	if (currentComment) {
          // update comment
          let updateBody = {
              timestamp: Date.now(),
              body: values.body,
          }
          
          Promise.resolve()
          .then(() => update(currentComment.id, updateBody))
          .then(() => resetPostComments() )
          .then(() => reloadPostComments(values.parentId))
    	}
    	else {
          // add comment     
          let comment = {
              id: uuid.v4(),
              timestamp: Date.now(),
              body: values.body,
              author: values.author,
              parentId: values.parentId
          }
          Promise.resolve()
          .then(() => add(comment))
          .then(() => resetPostComments())
          .then(() => reloadPostComments(values.parentId))
          
    	}
    }
     
  }
	
  render() {
    const { currentComment, open, close, parentId } = this.props
    return (
      	<Dialog 
      		modal={false} 
      		title={currentComment && currentComment.id.length > 0 ? 'Edit comment' : 'New comment' } 
      		open={open} 
      		onRequestClose={close}
     	>
          <form onSubmit={this.handleSubmit} >
      		<input type="hidden" name="parentId" value={parentId} />
            <TextField
            id="commentBody"
      		name="body"
            hintText="Comment..."
            fullWidth={true}
            errorText="This field is required"
            multiLine={true}
            rows={4}
            defaultValue={currentComment ? currentComment.body : ''}
            />
      		{ !currentComment && <TextField
            id="commentAuthor"
      		name="author"
            errorText="This field is required"
            floatingLabelText="Author"
            defaultValue={currentComment ? currentComment.author : ''}
            /> }
            <div>
              <RaisedButton type="submit" label={currentComment ? 'Save' : 'Comment'} primary={true} />  
            </div>
          </form>
      	</Dialog>
    )
  }
}

function mapStateToProps({  posts, comments }) {
  return { currentComment: comments.currentComment,
           open: comments.open,
           parentId : posts.currentPost.id
         } 
}

function mapDispatchToProps(dispatch) {
	return {
      close: () => dispatch(openCommentDialog(null, false)),
      add: (comment) => dispatch(addComment(comment)),
      update: (id, body) => dispatch(updateComment(id, body)),
      reloadPostComments: (parentId) => dispatch(fetchPostComments(parentId)),
      resetPostComments: () => dispatch(initializePostComments())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentEditItem)