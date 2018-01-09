import React , { Component } from 'react'
import PostInfo from './PostInfo'
import PostEdit from './PostEdit'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { resetCategory, setOrderBy, setCategoryName } from '../actions/category'
import { fetchPosts, openPostDialog } from '../actions/post'
import { initializePostComments } from '../actions/comment'
import sortBy from 'sort-by'

import { FloatingActionButton, IconMenu, IconButton, MenuItem, Toolbar, ToolbarGroup } from 'material-ui'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import ContentAdd from 'material-ui/svg-icons/content/add';

class Category extends Component {
  
  componentDidMount() {
    const { name, setCategoryName } = this.props
    setCategoryName(name)
    this.loadData(name)
  }
  
  componentWillUnmount() {
  	const { reset, resetPostComments } = this.props
    reset()
    resetPostComments()
  }
  
  componentWillReceiveProps(nextProps) {
    // when change the category i must reload the related data
  	if (this.props.name !== nextProps.name) {
      const { setCategoryName } = this.props
      setCategoryName(nextProps.name)
      this.loadData(nextProps.name)
    }
  }
  
  // load current category data
  loadData(name) {
    const { loadPosts, reset, resetPostComments } = this.props
    reset()
    resetPostComments()
    loadPosts(name)
  }
  
  render() {
    const { posts, categories, changeOrder, openEditPost} = this.props
    let categoryPosts = posts.items
	const heading = this.props.name && this.props.name.length > 0 ? `Posts of ${this.props.name} category` : 'All posts'
    const addCommentButtonStyle = { position: 'fixed', bottom: '32px', right: '32px' }
    
    if (categoryPosts)
    	categoryPosts.sort(sortBy(`${categories.currentCategory.order === 'DESC' ? '-' : ''}${categories.currentCategory.orderField}`))

    return (
    	<div>
      		<Toolbar>
         		<ToolbarGroup>
      				{heading}
      			</ToolbarGroup>
      			<ToolbarGroup>
      				<IconMenu
                      iconButtonElement={<IconButton><ContentFilter /></IconButton>}
                      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    >
                      <MenuItem
                        primaryText="Order by"
                        rightIcon={<ArrowDropRight />}
                        menuItems={[
                          <MenuItem primaryText="voteScore" leftIcon={categories.currentCategory.orderField === 'voteScore' ? <RadioButtonChecked /> : <RadioButtonUnchecked />} onClick={() => changeOrder(this.primaryText, categories.currentCategory.order)} />,
                          <MenuItem primaryText="timestamp" leftIcon={categories.currentCategory.orderField === 'timestamp' ? <RadioButtonChecked /> : <RadioButtonUnchecked />} onClick={() => changeOrder('timestamp', categories.currentCategory.order)} />,
                        ]}
                      />

                      <MenuItem primaryText="Ascending" leftIcon={categories.currentCategory.order === 'ASC' ? <RadioButtonChecked /> : <RadioButtonUnchecked />} onClick={() => changeOrder(categories.currentCategory.orderField, 'ASC')} />
      				  <MenuItem primaryText="Descending" leftIcon={categories.currentCategory.order === 'DESC' ? <RadioButtonChecked /> : <RadioButtonUnchecked />} onClick={() => changeOrder(categories.currentCategory.orderField, 'DESC')} />
      				</IconMenu>
      			</ToolbarGroup>
      		</Toolbar>
			{ categoryPosts && categoryPosts.map( (post) => (
				<PostInfo key={post.id} post={post} />	
				))
            }
			{ (!categoryPosts || categoryPosts.length === 0) && (<h4>Ops... there aren't posts for this category.</h4>)}
            { posts.open === true && (<PostEdit />)}
            <FloatingActionButton 
				title="Add new post" 
				style={addCommentButtonStyle} 
				onClick={() => openEditPost()}
				>
					<ContentAdd />
			</FloatingActionButton>
        </div>
    )
  }
}

function mapStateToProps({ categories, posts }) {
	return { categories, posts }
}

function mapDispatchToProps(dispatch) {
  return {
    loadPosts: (categoryName) => dispatch(fetchPosts(categoryName)),
    changeOrder: (orderField, order) => dispatch(setOrderBy(orderField, order)),
    reset: () => dispatch(resetCategory()),
    setCategoryName: (name) => dispatch(setCategoryName(name)),
    resetPostComments: () => dispatch(initializePostComments()),
    openEditPost: () => dispatch(openPostDialog(null, true))
    
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Category))