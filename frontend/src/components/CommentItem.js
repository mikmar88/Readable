import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import  Timestamp from 'react-timestamp'
import { openCommentDialog, fetchPostComments, initializePostComments, voteComment, fetchDeleteComment } from '../actions/comment'

import  CommentEditItem from './CommentEditItem'

import { Avatar, Badge, Card, CardActions,CardTitle, CardText } from 'material-ui'
import { grey400, yellow500 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import Delete from 'material-ui/svg-icons/action/delete'
import ThumbDown from 'material-ui/svg-icons/action/thumb-down'
import ThumbUp from 'material-ui/svg-icons/action/thumb-up'
import Star from 'material-ui/svg-icons/toggle/star'


class CommentItem extends Component {
  
  // execute the edit operation
  editComment() {
  	const { openEditComment } = this.props
    openEditComment(this.props.comment)
  }
  
  // execute the vote action
  voteAction(commentId, voteType, parentId) {
  	const { vote, reloadComments, resetComments } = this.props
    Promise.resolve()
    .then(() => vote(commentId, voteType, parentId))
    .then(() => resetComments())
    .then(() => reloadComments(parentId))
  }
  
  // execute the delete action
  deleteAction(id,parentId) {
  	const { deleteComment, reloadComments, resetComments } = this.props
    
    Promise.resolve()
    .then(() => deleteComment(id))
    .then(() => resetComments())
    .then( () => reloadComments(parentId))
  }

  render() {
    const iconsStyle = { height: 18, width: 18 }
    const { comment } = this.props
    
    return (
      <div>
        <Card>
          <CardTitle><Avatar>{comment.author.charAt(0)}</Avatar> <strong>{comment.author}</strong>
            <div className="rightButtons">
                <IconButton iconStyle={iconsStyle} children={<ModeEdit color={grey400} />} onClick={ () => this.editComment() }/>
                <IconButton iconStyle={iconsStyle} children={<Delete color={grey400} />} onClick={ () => this.deleteAction(comment.id, comment.parentId)}/>
            </div>
          </CardTitle>
          <CardText>
            {comment.body}
          </CardText>
          <CardActions>
                <IconButton iconStyle={iconsStyle} children={ <ThumbDown />} onClick={() => this.voteAction(comment.id, 'downVote', comment.parentId)} />
                <IconButton iconStyle={iconsStyle} children={ <ThumbUp />} onClick={() => this.voteAction(comment.id, 'upVote', comment.parentId)}/>
                <Badge style={iconsStyle} badgeContent={comment.voteScore} secondary={true}>
                  <Star style={iconsStyle} color={yellow500} />
                </Badge>
                <Timestamp className="commentInfo" time={comment.timestamp/1000} />
          </CardActions>
        </Card>
		<CommentEditItem />
	</div>
    )
  }

}

function mapDispatchToProps(dispatch) {
  return {
  	vote: (id, vote, parentId) => dispatch(voteComment(id, vote, parentId)),
    deleteComment: (id, parentId) => dispatch(fetchDeleteComment(id, parentId)),
    openEditComment: (comment) => dispatch(openCommentDialog(comment, true)),
    reloadComments: (parentId) => dispatch(fetchPostComments(parentId)),
    resetComments: () => dispatch(initializePostComments())
  }
}

export default withRouter(connect(null, mapDispatchToProps)(CommentItem))