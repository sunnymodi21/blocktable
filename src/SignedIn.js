import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { UserSession, getPublicKeyFromPrivate } from 'blockstack'
import MyTable from './MyTable'
import NavBar from './NavBar'
import { appConfig } from './constants'
import './SignedIn.css'


class SignedIn extends Component {

  constructor(props) {
    super(props)
    this.userSession = new UserSession({ appConfig })
    this.signOut = this.signOut.bind(this)
  }

  signOut(e) {
    e.preventDefault()
    this.userSession.signUserOut()
    window.location = '/'
  }
 
  addPublicKey(){
    const userData = this.userSession.loadUserData()
    const publicKey = getPublicKeyFromPrivate(userData.appPrivateKey)
    this.userSession.putFile('key.json', JSON.stringify(publicKey),{ encrypt: false })
  }

  render() {
    const username = this.userSession.loadUserData().username
    const userSession = this.userSession
    if(window.location.pathname === '/') {
      return (
        <Redirect to={`/mytable`} />
      )
    }

    return (
      <div className="component">
      <NavBar username={username} signOut={this.signOut}/>
      <Switch>
        <Route
          path={`/mytable`}
          render={
            routeProps => <MyTable
            protocol={window.location.protocol}
            userSession={userSession}
            realm={window.location.origin.split('//')[1]}
            {...routeProps} />
          }
        />
      </Switch>
      </div>
    );
  }
}

export default SignedIn
