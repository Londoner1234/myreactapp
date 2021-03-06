// Import React
import React, { Component } from 'react';
 
import {Router,navigate} from '@reach/router' ;
import firebase from './Components/Firebase/Firebase' ; 

import Home from './Components/Home/Home' ; 
import Welcome from './Components/Welcome/Welcome' ; 
import Navigation from './Components/Navigation/Navigation' ; 
import Login from './Components/Login/Login' ; 
import Meeting from './Components/Meeting/Meeting' ; 
import Register from './Components/Register/Register' ;
import CheckIn from './Components/Meeting/CheckIn' ;
import Attendees from './Components/Attendees/Attendees' ;



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
    firebase.auth().onAuthStateChanged(FBUser => {
      if(FBUser){
        this.setState({
          user: FBUser, 
          displayName: FBUser.displayName, 
          userID: FBUser.uid 
        });

        const meetingRef = firebase.database().ref('meetings/' + FBUser.uid);  

        meetingRef.on('value', snapshot => {
          let meetings = snapshot.val() ; 
          let meetingsList = [] ; 

          for(let item in meetings){
              meetingsList.push({
                meetingID: item, 
                meetingName : meetings[item].meetingName 
              }); 
            
          }

          this.setState({
              meetings: meetingsList, 
              howManyMeetings : meetingsList.length
          });

        })
      }
      else{
        this.setState({user: null }) ; 
      }
    });

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

  logOutUser = e => {
    e.preventDefault();
    this.setState({
      displayName: null,
      userID: null,
      user: null
    });

    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate('/login');
      });
  };

  addMeeting = meetingName => {
    const ref = firebase
      .database()
      .ref(`meetings/${this.state.user.uid}`);
    ref.push({ meetingName: meetingName });
  };
  render() {
    return (
      <div> 




        <Navigation
          user={this.state.user}
          logOutUser={this.logOutUser}
        />
        {this.state.user && (
          <Welcome
            userName={this.state.displayName}
            logOutUser={this.logOutUser}
          />
        )}
        <Router> 
          <Home path="/" user={this.state.user} /> 
          <Login path="/login"  /> 
          <Meeting path="/meetings"  
            addMeeting={this.addMeeting} 
            userID={this.state.userID}
            meetings={this.state.meetings}
          /> 
          <CheckIn path="/checkin/:userID/:meetingID"  
          /> 
          <Attendees path="/attendees/:userID/:meetingID" 
            adminUser={this.state.userID} 
          /> 
          <Register path="/register"  registerUser={this.registerUser}/> 
          <Login path="/login"  /> 
        </Router>

      </div>
    ) ;  
  } 
 
}

export default App;
