import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import CategoryList from './CategoryList'
import Category from './Category'
import PostDetail from './PostDetail'
import { withRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'

class App extends Component {

  render() {
    return (
      <MuiThemeProvider>
      	<div>
      		<Route path="/" render={({history}) => {
      				const goHome = () => {
                      history.push('/')
                    }
      				return (<AppBar title="My Readable App" style={{'backgroundColor': '#01579B'}} iconElementLeft={<IconButton onClick={goHome}><ActionHome /></IconButton>}/>)
    			}
  			} />
			<div className="appContent">
            <Route exact path="/" render={() => (
                <div>
                	<CategoryList />
                    <Category />
                </div>
            )} 
            />
			<Route exact path="/:name" render={({match}) =>  ( 
              <div>
              	<CategoryList />
              	<Category name={match.params.name}/>
              </div> ) } 
            />
              
            <Route exact path="/:category/:id" render={({match}) =>  ( 
              <PostDetail />) } 
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps ({ categories }) {
  return { categories }
}

export default withRouter(connect(mapStateToProps, null)(App))
