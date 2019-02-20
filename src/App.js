// Import React
import React, { Component } from 'react';
 
import {Router,navigate} from '@reach/router' ;
import firebase from './Firebase' ; 

import Home from './Home' ; 
import Welcome from './Welcome' ; 
import Navigation from './Navigation' ; 
import Login from './Login' ; 
import Meeting from './Meeting' ; 
import Register from './Register' ;



class App extends Component {

   
  constructor(){
    super() ; 
    this.state  = {
      user: null , 
      displayName: null , 
      userId: null 
    } ; 
  }


  componentDidMount(){
    const ref = firebase.database().ref('user') ; 
    ref.on('value', snapshot => {
        let FBUser = snapshot.val() ; 
        this.setState({user: FBUser}) ; 
    })
  }

  registerUser = userName => {
    firebase.auth().onAuthStateChanged(FBUser => {
      FBUser.updateProfile({
        displayName: userName
      }).then(() => {
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        });
        navigate('/meetings');
      });
    });
  };
  render() {
    return (
      <div> 
        <Navigation user={this.state.user} /> 
        {this.state.user && <Welcome user={this.state.displayName} />}  

        <Router> 
          <Home path="/" user={this.state.displayName} /> 
          <Login path="/login"  /> 
          <Meeting path="/meetings"  /> 
          <Register path="/register"  registerUser={this.registerUser}/> 
          <Login path="/login"  /> 
        </Router>

      </div>
    ) ;  
  } 
 
}

export default App;
