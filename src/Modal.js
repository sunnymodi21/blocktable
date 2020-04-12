import React,{Component}  from 'react';
import './Modal.css'

class Modal extends Component {

  render(){

    return (
        <div className="modal" style={{display: 'block'}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Table</h5>
                <button type="button" className="close" onClick={this.props.handleClose} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.props.children}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.props.handleClose}>Close</button>
                <button type="button" className="btn btn-primary" onClick={this.props.onSave}>Save</button>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default Modal