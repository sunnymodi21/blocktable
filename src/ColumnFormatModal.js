import React,{Component}  from 'react';
import Modal from './Modal';
import './Modal.css'

class ColumnFormatModal extends Component {

    createDropdown(){

        let columnsHTML = this.props.columns.map((columnName)=>{
            const columnHTML =         
            <div className="form-group row" key={columnName}>
                <label class="col-sm-2 col-form-label">{columnName}</label>
                <div className="col-sm-10">
                    <select className="form-control">
                        <option value="input" selected>Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="progress">Progress</option>
                        <option value="star">Rating</option>
                        <option value="boolean">Checkbox</option>
                        <option value="select">Select</option>
                    </select>
                </div>
            </div>
        return columnHTML
        })   
        return columnsHTML  
    }
    render(){

        return (
            <Modal>
                <form>
                    {this.createDropdown()}
                </form>
            </Modal>
        )
    }
}

export default ColumnFormatModal