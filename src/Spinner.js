import React,{Component}  from 'react';
import './Modal.css'

class Spinner extends Component {

  render(){

    return (
        <div className="modal" style={{display:'block'}}>
            <div className="modal-dialog" role="document">
                <div className="d-flex justify-content-center">
                    <span className="spinner-border text-light" role="status">
                        <span className="sr-only">Loading...</span>
                    </span>
                </div>
            </div>
        </div>
    )
  }
}

export default Spinner