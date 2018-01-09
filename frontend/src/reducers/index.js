import { combineReducers } from 'redux'
import { GET_POSTS, GET_POST, VOTE_POST, OPEN_EDIT_POST } from '../actions/post'
import { GET_CATEGORIES, GET_CATEGORY_POSTS, SET_ORDER_BY, SET_CATEGORY_NAME  } from '../actions/category'
import { OPEN_EDIT_COMMENT, SET_CURRENT_COMMENT, LOAD_COMMENTS, INITIALIZE_POST_COMMENTS } from '../actions/comment'

const initialPosts = {
  items: [],
  currentPost: null,
  open: false
}

const initialCategories = {
	items: null,
    currentCategory: { 
      name: null,
      orderField: 'voteScore', 
      order: 'DESC' 
    }
}

const initialComment = {
	currentComment: null,
  	open: false,
  	items: []
}

function posts( state=initialPosts, action) {
	switch (action.type){
      case GET_POSTS:
        const { items } = action
        return {...{ ...state, items}}
      case GET_POST:
        const { currentPost } = action
        return { ...state, currentPost}
      case VOTE_POST:
        const { voteScore } = action
        return { ...state, currentPost: { ...state.currentPost, voteScore } }
      case OPEN_EDIT_POST:
        const { open } = action
        return { ...state, open }
      default:
        return state
    }
}

function categories( state=initialCategories, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      const { items  } = action
      return {...state, items }
    case GET_CATEGORY_POSTS:
      const { posts } = action
      return { ...state, currentCategory : { ...state.currentCategory, posts} }
    case SET_ORDER_BY:
      const { orderField, order } = action
      const currentCategory = { ...state.currentCategory, orderField, order }
      return { ...state, currentCategory }
    case SET_CATEGORY_NAME:
      const { name } = action
      return { ...state, currentCategory: {...state.currentCategory, name }}
    default:
      return state
  }
}

function comments( state=initialComment, action) {
 	switch (action.type) {
      case OPEN_EDIT_COMMENT:
        const { open } = action
        return { ...state, open }
      case SET_CURRENT_COMMENT:
        const { currentComment } = action
        return { ...state, currentComment }
      case LOAD_COMMENTS:
        let items = state.items.length > 0 ? state.items : []
        action.items.forEach(function(item) {
          items.push(item)
        })
        
        return action.items.length > 0 ? { ...state, items } : state
      case INITIALIZE_POST_COMMENTS:
        return { ...state, items: [] }
      default:
        return state
    } 
}

export default combineReducers({
  categories,
  posts,
  comments
})

