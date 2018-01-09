import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import serializeForm from 'form-serialize'

import { Dialog, MenuItem, RaisedButton, SelectField, TextField } from 'material-ui';
import uuid  from 'uuid'

import { openPostDialog, addPost, updatePost, fetchPosts, fetchPost } from '../actions/post'

class PostEdit extends Component {
  
  state = {
    postCategory: null
  }

  componentDidMount() {
    const { currentPost, categories } = this.props
	const currentCategory = categories.currentCategory
  	this.setState({ postCategory: currentPost ? currentPost.category : (currentCategory ? currentCategory.name : null)})
  }
  
// handle the form submit
  handleSubmit = (e) => {
    if (!e) 
      return;
    
    e.preventDefault()
    const { currentPost, add, update, reloadPosts, categories, loadPost } = this.props
    
    const values = serializeForm(e.target, { hash: true })

    if (currentPost) {
        // update comment
        let updateBody = {
          title: values.title,
          body: values.body,
          category: this.state.postCategory
        }

        Promise.resolve()
          .then(() => { 
          		update(currentPost.id, updateBody)
          		return categories.currentCategory.name
        	})
      	  .then((category) => reloadPosts(category) )
      	  .then(() => loadPost(currentPost.id))
      	  
      }
      else {
        // add comment     
        let post = {
          id: uuid.v4(),
          timestamp: Date.now(),
          title: values.title,
          body: values.body,
          author: values.author,
          category: this.state.postCategory
        }
        Promise.resolve()
          .then(() => { add(post) 
                       return categories.currentCategory.name })
          .then((category) => reloadPosts(category) )
      }
    }

  // handle the category field change
  handleChange = (event, index, value) => this.setState({postCategory: value});
	
  render() {
    const { currentPost, open, close, categories } = this.props
  	return (
       <Dialog 
        modal={false} 
        title={currentPost && currentPost.id.length > 0 ? 'Edit post' : 'New post' } 
        open={open} 
        onRequestClose={close}
     	>
          <form onSubmit={this.handleSubmit} >
        	<TextField
            id="postTitle"
      		name="title"
            errorText="This field is required"
            floatingLabelText="Title"
            defaultValue={currentPost ? currentPost.title : ''}
            />
            <TextField
            id="postBody"
      		name="body"
            hintText="Post..."
            fullWidth={true}
            errorText="This field is required"
            multiLine={true}
            rows={4}
            defaultValue={currentPost ? currentPost.body : ''}
            />
      		{ !currentPost && <TextField
            id="postAuthor"
      		name="author"
            errorText="This field is required"
            floatingLabelText="Author"
            defaultValue={currentPost ? currentPost.author : ''}
            /> }
      		<br />
        	<SelectField
      		  id="postCategory"
              floatingLabelText="Category"
			  value={this.state.postCategory}
      		  onChange={this.handleChange}
            >
      		{
      			categories.items.map((category) => (<MenuItem key={category.name} value={category.name} primaryText={category.name} /> ))
      		}
          	</SelectField>
            <div>
              <RaisedButton type="submit" label={currentPost ? 'Save' : 'Add'} primary={true} />  
            </div>
          </form>
      	</Dialog>
    )
  }

}

function mapStateToProps({ posts, categories }) {
	return {
      currentPost: posts.currentPost,
      open: posts.open,
      categories
    }
}

function mapDispatchToProps(dispatch) {
  return {
	close: () => dispatch(openPostDialog(null, false)),
    add: (post) => dispatch(addPost(post)),
    update: (id, body) => dispatch(updatePost(id, body)),
    reloadPosts: (category) => dispatch(fetchPosts(category)),
    loadPost: (id) => dispatch(fetchPost(id))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostEdit))

