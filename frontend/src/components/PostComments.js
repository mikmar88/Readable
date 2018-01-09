import React , { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import CommentItem from './CommentItem'
import CommentEditItem from './CommentEditItem'

import sortBy from 'sort-by'

class PostComments extends Component {
  
 	render() {
      	const { comments, posts } = this.props
        const currentPost = posts.currentPost
        
        let postComments = comments && comments.items && comments.items.length > 0 ? comments.items.filter((comment) => comment.parentId === currentPost.id) : null
        if (postComments)
    		postComments.sort(sortBy('-voteScore'))
        
    	return (
          <div>
          	{ postComments && postComments.length > 0 && (
             	  <h4>Comments</h4>
             )}
          	{ postComments && postComments.length > 0 && (
             	  postComments.map( (c) => 
                      <CommentItem key={c.id} comment={c} /> )
             )}
            <CommentEditItem />
          </div>
        )
    } 
}

function mapStateToProps({ comments, posts  }) {
  return { comments, posts}
}

export default withRouter(connect(mapStateToProps, null)(PostComments))