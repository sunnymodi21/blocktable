import React, { Component } from 'react'
import './App.css'
import { UserSession } from 'blockstack'


import SignedIn from './SignedIn'
import Landing from './Landing'

class App extends Component {

  constructor() {
    super()
    this.userSession = new UserSession()
  }

  componentDidMount() {
    const session = this.userSession
    if(!session.isUserSignedIn() && session.isSignInPending()) {
      session.handlePendingSignIn()
      .then((userData) => {
        if(!userData.username) {
          throw new Error('This app requires a username.')
        }
        window.location = '/'
      })
    }
  }

  render() {
    return (
      <main role="main">
          {this.userSession.isUserSignedIn() ?
            
            <SignedIn />
          :
            <Landing />
          }
      </main>
    );
  }
}

export default App
