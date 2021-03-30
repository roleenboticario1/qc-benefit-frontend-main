import $ from "jquery";
import React, { Component, createRef } from "react";
import TransactionDataService from "../../services/transaction.service";
import BenefitDataService from "../../services/benefit.service";
import UploadfileDataService from "../../services/uploadfile.service";

import { Link } from "react-router-dom";
import { withSnackbar } from "notistack";

import { Avatar, withStyles, Box, Button, Grid, Container, Card, CardContent, Switch, TextField} from '@material-ui/core'; 
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import LinearProgress from '@material-ui/core/LinearProgress';
import Icon from '@material-ui/core/Icon';

window.jQuery = $;
window.$      = $;

require("jquery-ui-sortable");
require("formBuilder");

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height      : 15,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#EEEEEE",
  },
  bar: {
    borderRadius   : 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);



class EditTransactions extends Component {

  constructor(props) {
    super(props);
    this.getBenefits           = this.getBenefits.bind(this);
    
    this.onChangeUserIdNo      = this.onChangeUserIdNo.bind(this);
    this.onChangeBenefitId     = this.onChangeBenefitId.bind(this);
    this.onChangeApprove       = this.onChangeApprove.bind(this);
    this.onChangeStatus        = this.onChangeStatus.bind(this);
    this.onChangeAmount        = this.onChangeAmount.bind(this);
    this.onChangeDetails       = this.onChangeDetails.bind(this);
    this.onChangeCustomAnswers = this.onChangeCustomAnswers.bind(this);
    this.onPopulateAnswers     = this.onPopulateAnswers.bind(this);
    
    this.getTransaction        = this.getTransaction.bind(this);
    this.updateTransaction     = this.updateTransaction.bind(this);
    this.deleteTransaction     = this.deleteTransaction.bind(this);
    
    this.selectFile            = this.selectFile.bind(this);  
    this.getUploadFiles        = this.getUploadFiles.bind(this);
    this.uploadfile            = this.uploadfile.bind(this);
    this.downloadThisFile      = this.downloadThisFile.bind(this);
    this.openAppointment  = this.openAppointment.bind(this);
    this.getBenefitData  = this.getBenefitData.bind(this);

    this.fb            = createRef();
    this.thisFirstLoad = false;
    this.fbDom         = "";


    this.state = {
      currentTransaction: {
        id           : null,
        userIdno     : "",
        benefitId    : "",
        approved     : 0,
        status       : 0,
        amount       : 0,
        details      : "",
        customAnswers: [],
      },     
      selectedFiles: undefined,
      currentFile  : undefined,
      progress     : 0,
      message      : "",
      isError      : false,
      benefits     : [],
      benefitName  : "",
      categoryName: "",
      departmentName: "",
      uploadFiles  : [],
      fileDescription: "",
      fetchFiles   : true,

      iframe: '<iframe src="https://www.example.com/show?data..." width="540" height="450"></iframe>'

    };
  }

  /**
   * GEt all transaction and benefits first
   * @return {[type]} [description]
   */
  componentDidMount() {
    this.getTransaction(this.props.match.params.id);
    this.getBenefits();
    this.getUploadFiles();
  };


  /**
   * Populate answer upon changing the category
   * @return {[type]} [description]
   */
  componentDidUpdate(){
    this.onPopulateAnswers(this.state.currentTransaction.customAnswers);
    if(this.state.fetchFiles){
      this.getUploadFiles();
      this.getBenefitData();
    }
  }


  openAppointment(){
    // TODO: Further enhancements
    let mainUrl =  "http://qaappointments.sparksoft.com.ph/appointment/data/";
    let options = {
      "user_id"    : 1282,
      "department" : this.state.departmentName,
      "name"       : this.state.currentTransaction.userIdno,
      "follow-up"  : true,
      "description": `Follow-up appointment for ${this.state.currentTransaction.userIdno} regarding ${this.state.benefitName}. Ref. No. ${this.state.currentTransaction.id}`
    }

    window.open(mainUrl + encodeURI(JSON.stringify(options)));
  }

  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files
    });
  }

  uploadfile() {
    if(!this.state.fileDescription){
      this.props.enqueueSnackbar('File description is blank.', {variant: "warning"});
      return false;
    }

    let currentFile = this.state.selectedFiles[0];

    this.setState({
      progress   : 0,
      currentFile: currentFile,
    });

    let data = {
      file: currentFile,
      desc: this.state.fileDescription,
      transactionId: this.props.match.params.id,
      userId: this.state.currentTransaction.userIdno
    };

    UploadfileDataService.uploadfiles(data, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message    : response.data.message,
          isError    : false,
          currentFile: undefined,
          uploadFiles: [],
          fetchFiles : true
        });
        this.props.enqueueSnackbar('File uploaded.', {variant: "success"});
      })
      .catch(() => {
        this.setState({
          progress   : 0,
          currentFile: undefined,
          isError    : true
        });

        this.props.enqueueSnackbar('File could not be uploaded.', {variant: "error"});
      });

      this.setState({
        selectedFiles: undefined,
      });
  }


  getUploadFiles(){
    console.log("fetch files");
    let options = {
      transactionId: this.props.match.params.id
    }
    UploadfileDataService.getFilePerTransaction(options)
      .then(response => {
        let fileDataArray = [];
        response.data.forEach( file => fileDataArray.push(file));
        this.setState({
          uploadFiles: fileDataArray,
          fetchFiles : false
        });
      })
      .catch(e =>{
        console.log(e);
      })
  }


  /**
  /**
   * get all Departments for select option
   * @return {[type]} [description]
   */
  getBenefits() {
    BenefitDataService.getAll()
      .then(response => {
        let benefitsApi = response.data.map(benefit => {
          return { id: benefit.id, name: `${benefit.name}` }
        });
        this.setState({
          benefits: [{ id: '', name: '(Select Benefit)' }].concat(benefitsApi)
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  /**
   * change user id no
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onChangeUserIdNo(e) {
    const userIdno = e.target.value;

    this.setState(prevState => ({
      currentTransaction: {
        ...prevState.currentTransaction,
        userIdno: userIdno
      }
    }));
  }

  /**
   * change benefit id
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onChangeBenefitId(e) {
    const benefitId = e.target.value;

    this.setState(function(prevState) {
      return {
        currentTransaction: {
          ...prevState.currentTransaction,
          benefitId: benefitId
        }
      };
    });

    this.getBenefitData();
  }

  getBenefitData(){
    console.log("GET BENEFIT DATA");
    BenefitDataService.get(this.state.currentTransaction.benefitId)
      .then(resp => {
        // check whether auto approved
        let isAutoApproved = resp.data.autoApprove;
        if(isAutoApproved){
          $("#approved").checked = true;
          $("#approved").attr("disabled", true);
        } else {
          $("#approved").attr("disabled", false);
        }

        this.setState({
          benefitName: resp.data.name,
          departmentName: resp.data.department.code,
          categoryName: resp.data.category.name
        });

        let dataToDisplay = resp.data.customFields;
        if (dataToDisplay === "" || dataToDisplay == null)
          dataToDisplay = "[]";

        $('#fb-editor').formRender({
          dataType: 'json',
          formData: dataToDisplay.replace(",{}", ""),
          i18n: { location: '../../lang' },
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  /**
   * change auto approve
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onChangeApprove(e) {
    var approved = e.target.checked;

    this.setState(function(prevState) {
      return {
        currentTransaction: {
          ...prevState.currentTransaction,
          approved: approved
        }
      };
    });
  }

  onChangeStatus(e) {
    var status = e.target.checked;

    this.setState(function(prevState) {
      return {
        currentTransaction: {
          ...prevState.currentTransaction,
          status: status
        }
      };
    });
  }

  onChangeAmount(e) {
    const amount = e.target.value;

    this.setState(prevState => ({
      currentTransaction: {
        ...prevState.currentTransaction,
        amount: amount
      }
    }));
  }

  onChangeDetails(e) {
    const details = e.target.value;

    this.setState(prevState => ({
      currentTransaction: {
        ...prevState.currentTransaction,
        details: details
      }
    }));
  }

  onChangeCustomAnswers(e) {
    const customAnswers = e.target.value;

    this.setState(prevState => ({
      currentTransaction: {
        ...prevState.currentTransaction,
        customAnswers: customAnswers
      }
    }));
  }


  getTransaction(id) {
    TransactionDataService.get(id)
      .then(response => {
        this.setState({
            currentTransaction: response.data
        });

        let dataToDisplay = response.data.benefit.customFields;
        if (dataToDisplay === "" || dataToDisplay == null)
          dataToDisplay = "[]";

        $('#addField-editor').formRender({
          dataType: 'json',
          formData: dataToDisplay.replace(",{}", ""),
          i18n: { location: '../../lang' },
        });

      })
      .catch(e => {
        console.log(e);
      });
  }

  onPopulateAnswers(answersStr){
    let jsonAnswers = JSON.parse(answersStr);

    for(let answer in jsonAnswers){
      let ansObj = jsonAnswers[answer];

      if($.inArray(ansObj.type, ["text", "number", "textarea", "date"]) !== -1 )
        $("#" + ansObj.id).val(ansObj.value);

      if($.inArray(ansObj.type, ["radio", "checkbox"]) !== -1  && ansObj.checked)
        $("#" + ansObj.id).attr("checked", true);

      if(ansObj.type === "select-one")
        $("#" + ansObj.id + " option[value=" + ansObj.value +"]").attr("selected","selected") ;

      if(ansObj.type === "select-multiple"){
        let multiSelected = ansObj.value;
        for( let m in multiSelected){
          $("#" + ansObj.id + " option[value=" + multiSelected[m] + "]").attr("selected", "selected");
        }        
      }
    }
  }

  updateTransaction(event) {
    event.preventDefault();
    let customAnswersHash = [];

    // get dynamic data
    $(".rendered-form :input").each(function(e){
      if(this.type === "select-multiple"){

        let valueSelected = [];
        for (var option of this.options){
          if (option.selected)
            valueSelected.push(option.value);
        }

        let dynamicInput = {
          id     : this.id, 
          type   : this.type, 
          name   : this.name, 
          value  : valueSelected,
          checked: this.checked,
        };

        customAnswersHash.push(dynamicInput);
      } else {
        let dynamicInput = {
          id     : this.id, 
          type   : this.type, 
          name   : this.name, 
          value  : this.value,
          checked: this.checked,
        };

        customAnswersHash.push(dynamicInput);        
      }

    });

    // get normal data
    var data = {
      userIdno     : this.state.currentTransaction.userIdno,
      benefitId    : this.state.currentTransaction.benefitId,
      approved     : this.state.currentTransaction.approved,
      status       : this.state.currentTransaction.status,
      amount       : this.state.currentTransaction.amount,
      details      : this.state.currentTransaction.details,
      customAnswers: customAnswersHash//this.state.customAnswers
    };

    TransactionDataService.update(
        this.state.currentTransaction.id,
        data
      )
      .then(response => {
        this.props.enqueueSnackbar('Successfully updated.', {variant: "success"});
        // this.setState({
        //     message: "The benefit was updated successfully!"
        // });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteTransaction(event) {
    event.preventDefault();
    if(window.confirm("Delete this item?")){
      TransactionDataService.delete(this.state.currentTransaction.id)
        .then(response => {
          this.props.enqueueSnackbar('Successfully deleted.', {variant: "success"});
          this.props.history.push('/transactions')
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  downloadThisFile(event){
    //console.log($.attr("className"));
  }

  render() {
    const { currentTransaction, currentFile, progress, selectedFiles, isError, message } = this.state;

    return (
        <Grid container spacing={1}>
          <Grid item className={"edit-form"} xs={8}>
            <Card>
              <CardContent>
                <form>
                  <div className={"form-group float-right"}>
                    <FormControlLabel
                      control={
                        <Switch type="checkbox"         // eslint-disable-next-line 
                            checked={currentTransaction.status == 1} 
                            onChange={this.onChangeStatus}
                            id={"status"}
                            inputProps={{ 'aria-label': 'Status' }}
                          />
                      }
                      label={"Complete"}
                    />
                    <FormControlLabel
                      control={
                         <Switch type={"checkbox"}      // eslint-disable-next-line 
                            checked={currentTransaction.approved == 1}
                            onChange={this.onChangeApprove}
                            id={"approved"}
                            inputProps={{ 'aria-label': 'Approved' }}
                          />
                      }
                      label={"Approved"}
                    />
                  </div>
                  <h4>Transaction</h4>
                  <div className={"form-group"}>
                    <label htmlFor={"benefitId"}>Benefit</label>
                    <select className={"form-control"} id={"benefitId"} value={currentTransaction.benefitId} onChange={this.onChangeBenefitId} disabled>
                      {this.state.benefits.map((benefit) => <option key={benefit.id} value={benefit.id}>{benefit.name}</option>)}
                    </select>
                  </div>
                  <div className={"form-group"}>
                    <label htmlFor="userIdno">User ID</label>
                    <input type={"text"} className={"form-control"} id={"userIdno"} required value={currentTransaction.userIdno} onChange={this.onChangeUserIdNo} name={"userIdno"} />
                  </div>
                  <div className={"form-group"}>
                    <label htmlFor={"amount"}>Amount</label>
                    <input type={"number"} className={"form-control"} id={"amount"} required value={currentTransaction.amount} onChange={this.onChangeAmount} name={"amount"} />
                  </div>
                  <div className={"form-group"}>
                    <label htmlFor={"details"}>Details</label>
                    <input type={"text"} className={"form-control"} id={"details"} value={currentTransaction.details} onChange={this.onChangeDetails} />
                  </div>
                  <div className={"form-group"}>
                    <div id={"addField-editor"} />
                  </div>
                </form>
                <button className={"btn btn-danger"} onClick={this.deleteTransaction} >
                  Delete
                </button>
                <button type={"submit"} className={"btn btn-info float-right"} onClick={this.updateTransaction} >
                  Update
                </button>
                <Link to={"/transactions"} className={"btn btn-default float-right"}>
                  Cancel
                </Link>
              </CardContent>
            </Card>
          </Grid>


          <Grid item className={"attachment-form"} xs={4}>
            <Button endIcon={<Icon>send</Icon>} onClick={this.openAppointment } variant="contained" color="primary"  size="large">
              Connect to Appointment
            </Button>

            <br/>
            <br/>
            <Card>
              <CardContent>
                <h4>Attachments</h4>
                <Container>
                  <TextField required id={"fileDescription"} label={"File Description"} 
                  onChange={e => this.setState({fileDescription: e.target.value}) } />
                  <br/><br/>
                  {currentFile && (

                    <Box className="mb25" display="flex" alignItems="center">
                        
                      <Box width="100%" mr={1}>
                        <BorderLinearProgress variant="determinate" value={progress} />
                      </Box>
                      <Box minWidth={35}>
                        <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
                      </Box>
                    </Box>)
                  }
                  <label htmlFor="btn-upload">
                    <input
                      id="btn-upload"
                      name="btn-upload"
                      style={{ display: 'none' }}
                      type="file"
                      onChange={this.selectFile} />
                    <Button
                      className="btn-choose"
                      variant="outlined"
                      component="span" >
                       Browse
                    </Button>
                  </label>&nbsp;
                  <Button
                    className="btn-upload"
                    color="primary"
                    variant="contained"
                    component="span"
                    disabled={!selectedFiles}
                    onClick={this.uploadfile}>
                    Upload
                  </Button>
                  <div className="file-name">
                  {selectedFiles && selectedFiles.length > 0 ? selectedFiles[0].name : null}
                  </div>
                  

                  <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
                    {message}
                  </Typography>

                </Container>
              </CardContent>
            </Card>
            <br/>
            <Card>
              <CardContent>
                <Container>
                  <h4>Files</h4>
                  {this.state.uploadFiles && this.state.uploadFiles.map((uploadfile, index) => (
                    <ListItem key={index}>
                      
                      <ListItemAvatar>
                        <a target="_blank" rel="noreferrer" href={process.env.REACT_APP_HTTPCOMMON + "/uploadfiles/download?id=" + uploadfile.id}>
                          <Avatar>
                            <CloudDownloadIcon />
                          </Avatar>
                        </a> 
                      </ListItemAvatar>
                      <a target="_blank" rel="noreferrer" href={process.env.REACT_APP_HTTPCOMMON + "/uploadfiles/download?id=" + uploadfile.id}>
                        <ListItemText primary={uploadfile.description} secondary={new Date(uploadfile.createdAt).toLocaleString()} />
                      </a>

                    </ListItem>
                  ))}
                </Container>
              </CardContent>

            </Card>
          </Grid>
        </Grid>
    );
  }
}

export default withSnackbar(EditTransactions);