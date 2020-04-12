import React, { Component } from 'react'
import sh from 'shorthash'
import { makeECPrivateKey, getPublicKeyFromPrivate,decryptContent } from 'blockstack'
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator.min.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import FileSelect from './FileSelect'
import Spinner from './Spinner'
import InfoModal from './InfoModal'

// const bytes = ['Bytes','KB', 'MB']

class MyTable extends Component {
  constructor(props){
    super(props)
    this.processFiles = this.processFiles.bind(this)
    this.userSession = this.props.userSession
    this.userData = this.props.userSession.loadUserData()
    this.file = {}
    this.state = {
      tables: [],
      loader: true,
      infoModal: false,
      info:"",
      tableData: [],
      fileDetails: {}
    }
    this.columns = [
    {title:"Name", field:"name", editor:"input", headerFilter: "input"},
    {title:"Task Progress", field:"task_progress",  formatterParams:{color:"#00dd00"},hozAlign:"left", formatter:"progress"},
    {title:"Gender", field:"gender", width:95, editor:"select", editorParams:{values:["male", "female"]}},
    {title:"Rating", field:"rating", formatter:"star", hozAlign:"center", width:100, editor:true},
    {title:"Color", field:"color", width:130, editor:"input"},
    {title:"Date Of Birth", field:"date_of_birth", width:130, sorter:"date", hozAlign:"center"},
    {title:"Driver", field:"driver", width:90,  hozAlign:"center", formatter:"tickCross", sorter:"boolean", editor:true}]
  }

  componentDidMount(){
    this.getTableList();
  }
  
  getTableList(){
    this.userSession.getFile('tables/index.json')
    .then((data)=> {
      if(data != null){
        let tables = JSON.parse(data)
        this.setState({
          tables,
          loader: false
        })
      } else {
        this.setState({
          loader: false
        })        
      }
    })
  }

  uploadTable(fileData, fileDetails){
    let tables = this.state.tables.map((doc)=>{
      doc.data = ""
      return doc
    })
    fileDetails.aesKey =  makeECPrivateKey()
    tables.push(fileDetails)
    this.uploadFile(fileData, fileDetails, tables)
  }

  uploadFile(fileData, fileDetails, tables, isEdit){
    // let options = { encrypt: false}
    let options = {encrypt: getPublicKeyFromPrivate(fileDetails.aesKey)}
    if(!isEdit){
      this.userSession.putFile('tables/index.json', JSON.stringify(tables), options)
    }
    this.userSession.putFile(`tables/${fileDetails.fileId}`, JSON.stringify(fileData), options)
    .then(()=>{
      this.setState({
        loader: false,
        tables
      })
    })
  }

  getTable(currentFile){
    this.setState({
      loader: true
    })
    console.log(currentFile.fileId)
    this.userSession.getFile('tables/'+currentFile.fileId, { decrypt: false })
    // this.userSession.getFile('tables/1586678990341VO7ei'+currentFile.fileId, { decrypt: false,username:"sunnymodi.id.blockstack" })
    .then((data)=> {
      if(data != null){
        data = decryptContent(data, { privateKey: currentFile.aesKey })   
        this.file = currentFile
        const tables = JSON.parse(data)
        this.setState({
          loader: false,
          tableData: tables,
          fileDetails: currentFile
        })
      }
    })
  }

  toShortFormat(date){
    const dateObj = new Date(date)
    const month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"]
    return "" + dateObj.getDate() + " " + month_names[dateObj.getMonth()] + " " + dateObj.getFullYear()
  }

  tableList(){
    const tableHTMLList = this.state.tables.map((file) =>{
      let row = ''
      row = 
        <tr key={file.date}>
          <td className="text-truncate cursor-pointer" style={{maxWidth: "100px"}} onClick={()=>this.getTable(file, false)} >
            {`${file.name}`}
          </td>
          <td className="text-truncate" style={{maxWidth: "80px"}}>{this.toShortFormat(file.date)}</td>
          <td>
            <span title="Delete" className="px-1 fa fa-trash cursor-pointer" onClick={()=>this.deleteTable(file)}>
            </span>
          </td>
        </tr>
      return row
    })
    return tableHTMLList
  }

  deleteTable(currentTable){
    this.setState({
     loader: true
    })
    const tables = this.state.tables.filter((table)=>{
       return table.fileId===currentTable.fileId ? false: true
     })
     this.userSession.deleteFile('tables/'+currentTable.fileId)
     this.userSession.putFile('tables/index.json', JSON.stringify(tables)).then(()=>{
       this.setState({
         loader: false,
         tables
       })
     })
     .catch(()=>{
       this.setState({
         loader: false
       })
     })
   }

  processFiles(files){
    let file = files[0]
    if (file!==undefined && /\.(txt|tsv)$/i.test(file.name)) {
      this.setState({
        loader: true
      })
      const reader  = new FileReader()
      reader.onload= (e)=>{
        let jsonDocs = []
        let data = e.target.result.toString();
        let lines = data.split('\n');
        let columnNames = lines[0].split('\t');
        let columnNames_keys = []
        for(let q = 0; q < columnNames.length; q++){
          let columnname = columnNames[q].toLowerCase().split(' ').join('_')
          columnNames_keys.push(columnname)
        }
        for(let i = 1; i<lines.length; i++) {
          let newDoc = {}
          let line = lines[i].split('\t')
          for(let j = 0; j<columnNames_keys.length; j++) {
            let currentColumn = line[j];
            newDoc[columnNames_keys[j]] = currentColumn;
          }
          jsonDocs.push(newDoc);
        }
        const fileObj = {}    
        const date = new Date()
        fileObj.date = date
        const timestamp = date.getTime()
        fileObj.fileId = timestamp+sh.unique(file.name)
        const fileNameArray = file.name.split(".")
        fileObj.name = fileNameArray.slice(0,fileNameArray.length-1).join('.')
        this.uploadTable(jsonDocs, fileObj)
      }
      reader.readAsText(file)
    } else {
      this.info = "File not supported."
      this.setState({
        infoModal:true
      })
    }
  }

  onInfoModalClose(){
    this.setState({
      infoModal: false,
      loader: false
    })
  }

  render() {
    const options = {
      layout:"fitColumns",      //fit columns to width of table
      responsiveLayout:"hide",  //hide columns that dont fit on the table
      tooltips:true,            //show tool tips on cells
      addRowPos:"top",          //when adding a new row, add it to the top of the table
      pagination:"local",       //paginate the data
      paginationSize:10,         //allow 7 rows per page of data
      movableColumns:true,      //allow column order to be changed
      resizableRows:true,       //allow row order to be changed
    }
    return (
    <div>
      {this.state.loader? <Spinner/>:''}
      {this.state.infoModal?
            <InfoModal info={this.info} handleClose={this.onInfoModalClose.bind(this)}/>:''} 
      {this.state.tableData.length===0?<div>
        <FileSelect
          processFiles = {this.processFiles}
        />
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.tableList()}
          </tbody>
        </table>
      </div>:''}
      <div className={`p-2 ${this.state.tableData.length>0?'':"d-none"}`}>
        <div className="p-1">
          <button
            className="btn btn-primary"
            onClick={()=> this.uploadFile(this.state.tableData, this.state.fileDetails, this.state.tables, true)}
            >Save
          </button>
          <span className="pl-1">
            <button
              className="btn btn-primary"
              onClick={()=> { this.setState({tableData: []})}}
              >Back
            </button>
          </span>
        </div>
        <ReactTabulator columns={this.columns} data={this.state.tableData} options={options} />
      </div>
    </div>
    );
  }
}

export default MyTable
