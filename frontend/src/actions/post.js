import { REACT_APP_BACKEND } from '../index.js'

export const ADD_POST = 'ADD_POST'
export const GET_POSTS = 'GET_POSTS'
export const GET_POST = 'GET_POST'
export const GET_POST_COMMENTS = 'GET_POST_COMMENTS'
export const VOTE_POST = 'VOTE_POST'
export const OPEN_EDIT_POST = 'OPEN_EDIT_POST'


// open the edit form
export const openEditPost = (open) => ({
	type: OPEN_EDIT_POST,
  	open
})

// open the edit form and set the current post
export function openPostDialog(post, open) {
	return function(dispatch) {
    	dispatch(getPost(post))
   		dispatch(openEditPost(open))	
    }
}

// add new post
export const addPost = (body) => dispatch => (
	fetch(`${REACT_APP_BACKEND}/posts`, 
          		{ headers: 
                 	{ 'Authorization': 'whatever-you-want', 
                      'Content-Type': 'application/json' 
                   	},
                  method: 'POST',
                  body: JSON.stringify(body) 
                } )
    .then( (res) => dispatch(openEditPost(false)) )
  )

// update an existing post
export const updatePost = (id, body) => dispatch => (
	fetch(`${REACT_APP_BACKEND}/posts/${id}`, 
          		{ headers: 
                 	{ 'Authorization': 'whatever-you-want', 
                      'Content-Type': 'application/json' 
                   	},
                  method: 'PUT',
                  body: JSON.stringify(body) 
                } )
    .then( (res) => { dispatch(openEditPost(false))  })
)

// retrieve all posts
export const getPosts = posts => ({
  type: GET_POSTS,
  items: posts
})

// get the post passed 
export const getPost = post => ({
  type: GET_POST,
  currentPost: post
})

// fetch all posts
export const fetchPosts = (category = '') => dispatch => (
    fetch(`${REACT_APP_BACKEND}${category.length > 0 ? '/'+category: '' }/posts`, { headers: { 'Authorization': 'whatever-you-want' } } )
    .then( (res) => { return res.status === 200 ? res.text() : null  })
	.then( (data) => { 
      	let posts = null
        
        try {
          posts = JSON.parse(data)
          posts = posts !== null ? posts.filter((post) => post.deleted === false) : null
        }
      catch(e) {
      	posts = null
      }
      	finally {
          dispatch(getPosts(posts))
        }
      
    })
)

// fetch the post identified by the parameter id
export const fetchPost = (id) => dispatch => (
	fetch(`${REACT_APP_BACKEND}/posts/${id}`, { headers: { 'Authorization': 'whatever-you-want' } } )
    .then( (res) => { return res.text()  })
  	.then((data) => { dispatch(getPost( JSON.parse(data) ) ) } )
)

// vote a post
export const newVote = voteScore => ({
  type: VOTE_POST,
  voteScore
})

// execute the vote action
export const votePost = (vote, id) => dispatch => (
	fetch(`${REACT_APP_BACKEND}/posts/${id}`, 
          		{ headers: 
                 	{ 'Authorization': 'whatever-you-want', 
                      'Content-Type': 'application/json' 
                   	},
                  method: 'POST',
                  body: JSON.stringify({'option': vote}) 
                } )
    .then( (res) => { return res.text()  })
	.then( (data) => { dispatch(newVote(JSON.parse(data).voteScore)) })
)

// execute the delete action
export const fetchDeletePost = (id) => dispatch => (
	fetch(`${REACT_APP_BACKEND}/posts/${id}`, 
          		{ headers: 
                 	{ 'Authorization': 'whatever-you-want', 
                   	},
                  method: 'DELETE'
                } )
    .then( (res) => { return res.text()  })
	.then( (data) => { fetchPosts() })
)