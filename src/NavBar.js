import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'

class NavBar extends Component {

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-light bg-blue fixed-top">
      <Link className="navbar-brand" to="/">Blocktable</Link>

      <div className="collapse navbar-collapse" id="navbarsExampleDefault">

      </div>
      <button
        className="btn btn-primary"
        onClick={this.props.signOut.bind(this)}
      >Sign out
      </button>
      </nav>
    )
  }
}

export default NavBar
