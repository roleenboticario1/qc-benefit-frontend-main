import $ from "jquery"; import React, { Component } from "react";
import TransactionDataService from "../../services/transaction.service";
import BenefitDataService from "../../services/benefit.service";
import { Link } from "react-router-dom";
import { withSnackbar } from "notistack";

window.jQuery = $;
window.$      = $;
require("jquery-ui-sortable");
require("formBuilder");
require('formBuilder/dist/form-render.min.js')

class AddTransaction extends Component {
  
  //Added
  token = "9137c9e9ebe5c1955c1847d795b68c05d1838a30269aa2995eab05cdcd3e6016"; 

  constructor(props) {
    super(props);

    this.getBenefits           = this.getBenefits.bind(this);
    
    this.onChangeUserIdno      = this.onChangeUserIdno.bind(this);
    this.onChangeBenefitId     = this.onChangeBenefitId.bind(this);
    this.onChangeApprove       = this.onChangeApprove.bind(this);
    this.onChangeStatus        = this.onChangeStatus.bind(this);
    this.onChangeAmount        = this.onChangeAmount.bind(this);
    this.onChangeDetails       = this.onChangeDetails.bind(this);
    this.onChangeCustomAnswers = this.onChangeCustomAnswers.bind(this);
    this.onChangeName          = this.onChangeName.bind(this);
    this.onChangeBirthDate     = this.onChangeBirthDate.bind(this);
    this.onChangeAge           = this.onChangeAge.bind(this);
    this.onChangeEmail         = this.onChangeEmail.bind(this);
    this.onChangeMobile        = this.onChangeMobile.bind(this);
    this.onChangeCivilStatus   = this.onChangeCivilStatus.bind(this);
    this.onChangeSex           = this.onChangeSex.bind(this);
    this.onChangeNationality   = this.onChangeNationality.bind(this);
     

    this.saveTransaction       = this.saveTransaction.bind(this);
    this.newTransaction        = this.newTransaction.bind(this);

    this.state = {
      id           : null,
      userIdno     : "",
      benefitId    : "",
      approved     : 0,
      amount       : 0,
      details      : "",
      name         : "",
      age          : "",
      civil_status : "",
      birthdate    : "",
      sex          : "",
      email        : "",
      mobile       : "",
      nationality  : "",
      customAnswers: [],
      submitted    : false,

      benefits: [],
      customFields: [],
      query: "" //Added
    };
  }

  componentDidMount() {
    this.getBenefits();
    this.search(""); //Added
  };

   onChange = e => {
    const { value } = e.target; //Added
    this.setState({
      query: value
    });

    this.search(value);
  }
  
  //Added
  search = query => {
    const url = `https://qaunifylb.unifysyscontrol.com/web-ums/index.php/Qcid_Api/get_info?search=${query}`;
    const token = {};
    this.token = token;

    fetch(url)
      .then(results => results.json())
      .then(data => {
        if (this.token === token) {
          this.setState({ people: data.results });
        }
      });
  };



  /**
   * get all Departments for select option
   * @return {[type]} [description]
   */
  getBenefits(){
    BenefitDataService.getAll()
      .then(response => {
        let benefitsApi = response.data.map(benefit => {
          return {id: benefit.id, name: `${benefit.name}`}
        });
        this.setState({
          benefits: [{id: '', name: '(Select Benefit)'}].concat(benefitsApi) 
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeUserIdno(e) {
    this.setState({
      userIdno: e.target.value
    });
  }

  onChangeBenefitId(e) {
    var benefitId =  e.target.value;
    this.setState({
      benefitId: benefitId
    });

    BenefitDataService.get(benefitId)
      .then(response => {
        // check whether auto approved
        let isAutoApproved = response.data.autoApprove;
        if(isAutoApproved){
          $("#approved").attr("checked", true);
          $("#approved").attr("disabled", true);
          $("labelForApproved").text("This is set to auto-approved");
        } else {
          $("labelForApproved").text("Approve this benefit?");
          $("#approved").attr("disabled", false);
        }

        let dataToDisplay = response.data.customFields;
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

  onChangeApprove(e){
    console.log(e.target.checked);
    this.setState({
      approved: e.target.checked
    });
  }

  onChangeStatus(e){
    console.log(e.target.checked);
    this.setState({
      status: e.target.checked
    });
  }

  onChangeAmount(e) {
    this.setState({
      amount: e.target.value
    });
  }

  onChangeDetails(e) {
    this.setState({
      details: e.target.value
    });
  }

  onChangeCustomAnswers(e) {
    this.setState({
      customAnswers: e.target.value
    });
  }

  onChangeName(e){
    this.setState({
      name : e.target.value
   });
  }
  
  onChangeBirthDate(e){
    this.setState({
     birthdate : e.target.value
   });
  }

   onChangeAge(e){
     this.setState({
      age: e.target.value
    });
   }

   onChangeNationality(e){
     this.setState({
      nationality: e.target.value
    });
   }

   onChangeEmail(e){
     this.setState({
      email: e.target.value
    });
   }

   onChangeMobile(e){
    this.setState({
      mobile: e.target.value
    });
   }
   
   onChangeCivilStatus(e){
     this.setState({
      civil_status: e.target.value
    });
   }
     
  onChangeSex(e){
    this.setState({
   sex: e.target.value
   });
  }
 
  saveTransaction() {
    let customAnswersHash = [];


    if(!this.state.userIdno){
      this.props.enqueueSnackbar('User could not be blank.', {variant: "warning"});
      return false;
    }

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

    console.log(customAnswersHash);

    // get normal data
    var data = {
      userIdno     : this.state.userIdno,
      benefitId    : this.state.benefitId,
      approved     : this.state.approved,
      status       : this.state.status,
      amount       : this.state.amount,
      name         : this.state.name,
      age          : this.state.age,
      email        : this.state.email,
      sex          : this.state.sex,
      birthdate    : this.state.birthdate,
      nationality  : this.state.nationality,
      mobile       : this.state.mobile,
      details      : this.state.details,
      civil_status : this.state.civil_status,
      customAnswers: customAnswersHash//this.state.customAnswers
    };

    console.log(data)

    TransactionDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          submitted: true
        });
        this.props.enqueueSnackbar('Transaction saved.', {variant: "success"});
        console.log(response.data);
      })
      .catch(e => {
        this.props.enqueueSnackbar('Something went wrong.', {variant: "error"});
        console.log(e);
      });
  }

  newTransaction() {
    this.setState({
      id           : null,
      userIdno     : "",
      benefitId    : "",
      approved     : 0,
      status       : 0,
      amount       : 0,
      details      : "",
      customAnswers: [],
      submitted    : false,
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully the transaction!</h4>
            <Link to={`/transactions/${this.state.id}/edit`} className={"btn btn-info"}>
              View again
            </Link>

            <Link to={"/transactions"} className={"btn btn-primary"}>
              Return to transactions
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="benefitId">Benefit</label>
              <select
                className="form-control"
                id="benefitId"
                value={this.state.benefitId}
                onChange={this.onChangeBenefitId}>
                {this.state.benefits.map((benefit) => <option key={benefit.id} value={benefit.id}>{benefit.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="userIdno">User ID</label>
              <input
                type="text"
                className="form-control"
                id="userIdno"
                required
                onChange={this.onChangeUserIdno}
                name="userIdno"
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                min="0"
                className="form-control"
                id="amount"
                required
                value={this.state.amount}
                onChange={this.onChangeAmount}
                name="amount"
              />
            </div>

            <div className="form-group">
              <label htmlFor="details">Details</label>
              <input
                type="text"
                className="form-control"
                id="details"
                required
                onChange={this.onChangeDetails}
                name="details"
              />
            </div>

            <div className="form-group">
              <input type="checkbox" id="approved" onChange={this.onChangeApprove}/>
              <label htmlFor="approved" id="labelForApproved">&nbsp;Approve this benefit?</label>
            </div>
            <div className="form-group">
              <input type="checkbox" id="status" onChange={this.onChangeStatus}/>
              <label htmlFor="status" id="labelForStatus">&nbsp;Status</label>
            </div>

             <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  required
                  onChange={this.onChangeName}
                  name="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nationality">Nationality</label>
                <input
                  type="text"
                  className="form-control"
                  id="nationality"
                  required
                  onChange={this.onChangeNationality}
                  name="nationality"
                />
              </div>

            <div className="form-group">
                <label htmlFor="birthdate">Birthday</label>
                <input
                  type="date"
                  className="form-control"
                  id="birthdate"
                  required
                  onChange={this.onChangeBirthDate}
                  name="birthdate"
                />
              </div>

            <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="text"
                  className="form-control"
                  id="age"
                  required
                  onChange={this.onChangeAge}
                  name="age"
                />
              </div>
            
              <div className="form-group">
                 <label htmlFor="sex">Sex</label>
                 <select
                   type="text"
                   className="form-control"
                   id="sex"
                   required
                   onChange={this.onChangeSex}
                   name="sex"
                  >
                  <option value="">------</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
            
             
              <div className="form-group">
                 <label htmlFor="civil_status">Civil Status</label>
                 <select
                   type="text"
                   className="form-control"
                   id="civil_status"
                   required
                   onChange={this.onChangeCivilStatus}
                   name="civil_status"
                  >
                  <option value="">------</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Separated">Separated</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

            <div className="form-group">
                <label htmlFor="mobile">Mobile No</label>
                <input
                  type="text"
                  className="form-control"
                  id="mobile"
                  required
                  onChange={this.onChangeMobile}
                  name="mobile"
                />
              </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  required
                  onChange={this.onChangeEmail}
                  name="email"
                />
              </div>

            <div className="form-group">
              <div id="addField-editor" />
            </div>
            <button onClick={this.saveTransaction} className={"btn btn-success float-right"}>
              Submit
            </button>
            <Link to={"/transactions"} className={"btn btn-default float-right"}>
              Cancel
            </Link>

          </div>
        )}
      </div>
    );
  }
}

export default withSnackbar(AddTransaction);