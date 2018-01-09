import { REACT_APP_BACKEND } from '../index.js'

export const LOAD_COMMENTS = 'LOAD_COMMENTS'
export const OPEN_EDIT_COMMENT = 'OPEN_EDIT_COMMENT'
export const SET_CURRENT_COMMENT = 'SET_CURRENT_COMMENT'
export const INITIALIZE_POST_COMMENTS = 'INITIALIZE_POST_COMMENTS'

// load all comments
export const loadComments = (comments) => ({
	type: LOAD_COMMENTS,
  	items: comments
})

// open the edit form
export const openEditComment = (open) => ({
	type: OPEN_EDIT_COMMENT,
  	open
})

// set the current comment
export const setComment = comment => ( {
	type: SET_CURRENT_COMMENT,
  	currentComment: comment
})

// initialize the comments state
export const initializePostComments = () => ({
	type: INITIALIZE_POST_COMMENTS
})

// retrieve comments for the specific post
export const fetchPostComments = (postId) => dispatch => (
	fetch(`${REACT_APP_BACKEND}/posts/${postId}/comments`, 
          	{ headers: { 'Authorization': 'whatever-you-want' } } )
    .then( (res) => { return res.status === 200 ? res.text() : null  })
	.then( (data) => { 
      	let comments = null;
      
      	try {
          comments = JSON.parse(data)
          comments = comments !== null ? comments.filter((comment) => comment.deleted === false) : null
        }
      	catch (e) {
        	comments = null
        }
      	finally {
          dispatch(loadComments(comments.filter((comment) => comment.deleted === false))) 
        }
    } )
)

// set the current comment and open the edit form
export function openCommentDialog(comment, open) {
	return function(dispatch) {
    	dispatch(setComment(comment))
   		dispatch(openEditComment(open))	
    }
}

// add new comment
export const addComment = (body) => dispatch => (
	fetch(`${REACT_APP_BACKEND}/comments`, 
          		{ headers: 
                 	{ 'Authorization': 'whatever-you-want', 
                      'Content-Type': 'application/json' 
                   	},
                  method: 'POST',
                  body: JSON.stringify(body) 
                } )
    .then( (res) => dispatch(openEditComment(false)) )
  )

// update an existing comment
export const updateComment = (id, body) => dispatch => (
	fetch(`${REACT_APP_BACKEND}/comments/${id}`, 
          		{ headers: 
                 	{ 'Authorization': 'whatever-you-want', 
                      'Content-Type': 'application/json' 
                   	},
                  method: 'PUT',
                  body: JSON.stringify(body) 
                } )
    .then( (res) => { dispatch(openEditComment(false))  })
  	.then((id) => { dispatch(fetchPostComments(id)) })
)

// vote a comment
export const voteComment = (id, vote, post) => dispatch => (
	fetch(`${REACT_APP_BACKEND}/comments/${id}`, 
          		{ headers: 
                 	{ 'Authorization': 'whatever-you-want', 
                      'Content-Type': 'application/json' 
                   	},
                  method: 'POST',
                  body: JSON.stringify({'option': vote}) 
                } )
)

// fetch the delete operation
export const fetchDeleteComment = (id, parentId) => dispatch => (
	fetch(`${REACT_APP_BACKEND}/comments/${id}`, 
          		{ headers: 
                 	{ 'Authorization': 'whatever-you-want', 
                   	},
                  method: 'DELETE'
                } )
)