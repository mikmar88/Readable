import { REACT_APP_BACKEND } from '../index.js'
export const GET_CATEGORIES = 'GET_CATEGORIES'
export const GET_CATEGORY_POSTS = 'SET_CATEGORY_POSTS'
export const SET_CATEGORY_NAME = 'SET_CATEGORY_NAME'
export const SET_ORDER_BY = 'SET_ORDER_BY'

// retrieve all categories
export const getCategories = categories => ({
  type: GET_CATEGORIES,
  items: categories
})

// fetch all categories
export const fetchCategories = () => dispatch => (
    fetch(`${REACT_APP_BACKEND}/categories`, { headers: { 'Authorization': 'whatever-you-want' } } )
    .then( (res) => { 
      return res.status === 200 ? res.text() : null;
    })
	.then( (data) => { 
      					let categories = null;
                        try {
                          categories = JSON.parse(data)
                          categories = categories !== null ? categories.categories : null
                        }
      					catch(e) {
                        	categories = null
                        }
                        finally {
                          dispatch(getCategories(categories))
                        }
     })
)

// reset current category and the related configuration of ordering
export const resetCategory = () => dispatch => (
  	dispatch(setOrderBy('voteScore', 'DESC'))
)

// set ordering configuration
export const setOrderBy = (orderField, order) => ({
  type: SET_ORDER_BY,
  orderField,
  order
})

// set category name
export const setCategoryName = (name) => ({
	type: SET_CATEGORY_NAME,
  	name
})