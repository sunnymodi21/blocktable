import React, { Component } from 'react'
import './Modal.css'

class InfoModal extends Component {
  render() {
    return (
      
      <div className="modal" style={{display: "block"}}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
            <div className="float-right">              
              <button type="button" className="close p-2" onClick={this.props.handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          <div className="modal-body">
            <div>{this.props.info}</div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={this.props.handleClose}>Close</button>
          </div>
        </div>
      </div>
  </div>
    );
  }
}

export default InfoModal

