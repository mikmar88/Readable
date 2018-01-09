import React, { Component } from 'react'
import { withRouter } from 'react-router'
import {List, ListItem} from 'material-ui/List';
import Folder from 'material-ui/svg-icons/file/folder';
import { connect } from 'react-redux'
import { fetchCategories } from '../actions/category'



class CategoryList extends Component {

  componentDidMount() {
    const { loadCategories } = this.props
	loadCategories()
  }
  
  // action to go to the selected category
  gotoCategory(categoryName){
    const { history } = this.props
    
    history.push(`/${categoryName}`)
  }

    render() {
      const { categories } = this.props
      
      return (
        <div>
         <h2>Categories</h2>
         <List>
          { categories.items && categories.items.map( (category) => 
              <ListItem key={category.name} leftIcon={<Folder />} onClick={() => this.gotoCategory(category.name)}>{category.name}</ListItem>
              )
          }
          </List>
        </div>
      );
    }
  
}

function mapStateToProps({ categories }) {
	return { categories }
}

function mapDispatchToProps(dispatch) {
	return { loadCategories: () => dispatch(fetchCategories())}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryList))