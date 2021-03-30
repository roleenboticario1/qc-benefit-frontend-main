import $ from "jquery";
import React, { Component, createRef } from "react";
import { withSnackbar } from "notistack";
import DepartmentDataService from "../../services/department.service";
import CategoryDataService from "../../services/category.service";
import BenefitDataService from "../../services/benefit.service";
import { Link } from "react-router-dom";
import App from './../../App';
import reportWebVitals from './../../reportWebVitals';
import './../../config';
import { AuthProvider } from './../../modules/auth';
import { BrowserRouter as Router } from 'react-router-dom';
import FormCreate from './../../modules/forms/form/components/FormCreate.js';
import { FormProvider } from './../../modules/forms/form/formContext';
import FormsList from './../../modules/forms/form/components/FormsList.js';
import FormView from './../../modules/forms/form/components/FormView.js';
import { getForm, useForm } from './../../modules/forms/form/formContext';
import {
  useSubmission,
  useSubmissions,
  saveSubmission,
  resetSubmissions
} from './../../modules/forms/submission';

import { SubmissionProvider, SubmissionsProvider } from './../../modules/forms/submission';

 
window.jQuery = $;
window.$      = $;
require("jquery-ui-sortable");
require("formBuilder");

class AddBenefit extends Component {
  constructor(props) {
    super(props);

    this.getDepartments       = this.getDepartments.bind(this);
    this.getCategories        = this.getCategories.bind(this);
    this.setCustomFields      = this.setCustomFields.bind(this);

    this.onChangeName         = this.onChangeName.bind(this);
    this.onChangeCode         = this.onChangeCode.bind(this);
    this.onChangeAutoApprove  = this.onChangeAutoApprove.bind(this);
    this.onChangeDepartmentId = this.onChangeDepartmentId.bind(this);
    this.onChangeCategoryId   = this.onChangeCategoryId.bind(this);
    this.onChangeCustomFields = this.onChangeCustomFields.bind(this);

    this.saveBenefit = this.saveBenefit.bind(this);
    this.newBenefit  = this.newBenefit.bind(this);

    this.fb = createRef(); 
    this.fbDom = "";

    this.state = {
      id          : null,
      name        : "",
      code        : "",
      departmentId: "",
      categoryId  : "",
      autoApprove : "",
      customFields: [],

      categories : [],
      departments: []
    };
  }

  componentDidMount() {
    this.getCategories();
    this.getDepartments();
    this.setCustomFields();
  };

  /**
   * get all Categories for select option
   * @return {[type]} [description]
   */
  getCategories(){
    CategoryDataService.getAll()
      .then(response => {
        let categoriesApi = response.data.map(category => {
          return {id: category.id, name: category.name}
        });
        this.setState({
          categories: [{id: '', name: '(Select Category)'}].concat(categoriesApi)
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  /**
   * get all Departments for select option
   * @return {[type]} [description]
   */
  getDepartments(){
    DepartmentDataService.getAll()
      .then(response => {
        let departmentsApi = response.data.map(department => {
          return {id: department.id, name: `[${department.code}] ${department.name}`}
        });
        this.setState({
          departments: [{id: '', name: '(Select Department)'}].concat(departmentsApi) 
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  /**
   * set custom fields formBuilder
   */
  setCustomFields(){
    var fbOptions = {
      disabledActionButtons: ['data', 'save'],
      i18n: {location: '../../lang'},
      disableFields: ['autocomplete', 'file', 'button', 'header'],
      controlOrder: [
        'header',
        'text',
        'textarea'
      ],
      editOnAdd: true,
      onAddField      : this.onChangeCustomFields,
      onClearAll      :  this.onChangeCustomFields,
      onCloseFieldEdit:  this.onChangeCustomFields,
    };
    this.fbDom = $("#addformbuilder").formBuilder(fbOptions);
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeCode(e) {
    this.setState({
      code: e.target.value
    });
  }

  onChangeDepartmentId(e) {
    this.setState({
      departmentId: e.target.value
    });
  }

  onChangeCategoryId(e) {
    this.setState({
      categoryId: e.target.value
    });
  }

  onChangeAutoApprove(e){
    this.setState({
      autoApprove: e.target.checked
    });
  }


  onChangeCustomFields() {
    var customFields = this.fbDom.actions.getData();
    console.log(customFields);
    this.setState({
      customFields: customFields
    });
  }

  saveBenefit(event) {
    event.preventDefault();
    if(!this.state.name || !this.state.code){
      this.props.enqueueSnackbar('Name or Code could not be blank.', {variant: "warning"});
      return false;
    }


    var data = {
      departmentId: this.state.departmentId,
      categoryId  : this.state.categoryId,
      autoApprove : this.state.autoApprove,
      customFields: this.state.customFields,
      name        : this.state.name,
      code        : this.state.code
    };

    console.log(data);
    BenefitDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          submitted: true
        });
        this.props.enqueueSnackbar('Successfully updated.', {variant: "success"});
        console.log(response.data);
        this.props.history.push('/benefits');
      })
      .catch(e => {
        this.props.enqueueSnackbar('Something went wrong.', {variant: "error"});
        console.log(e.message);
      });
  }

  newBenefit() {
    this.setState({
      id          : null,
      code        : "",
      departmentId: "",
      categoryId  : "",
      autoApprove : "",
      customFields: "",
      name        : "",
      submitted   : false
    });
  }

  render() {
    return (
      <div className="submit-form">
          <div>
            <div className="form-group">
              <label htmlFor="departmentId">Department</label>
              <select
                className="form-control"
                id="departmentId"
                value={this.state.departmentId}
                onChange={this.onChangeDepartmentId}>
                {this.state.departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="categoryId">Category</label>
              <select
                className="form-control"
                id="categoryId"
                onChange={this.onChangeCategoryId}>
                {this.state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Code *</label>
              <input
                type="text"
                className="form-control"
                id="code"
                required
                value={this.state.code}
                onChange={this.onChangeCode}
                name="code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                value={this.state.name}
                onChange={this.onChangeName}
                name="name"
              />
            </div>
            <div className="form-group">
                <input type="checkbox"
                  onChange={this.onChangeAutoApprove}
                />
                <label htmlFor="autoApprove">&nbsp;Auto-approved?</label>
              </div>
            <div className="form-group">               
            </div>
            <button onClick={this.saveBenefit} className={"btn btn-success float-right"}>
              Submit
            </button>

            <Link to={"benefits"} className={"btn btn-default float-right"}>
              Cancel
            </Link>
             <AuthProvider>
                <Router>
                    <App />
                </Router>
              </AuthProvider>
          </div>
      </div>
    );
  }
}

export default withSnackbar(AddBenefit);

  // <label htmlFor="name">Custom Fields</label>
   //            <div id="addformbuilder" ref={this.fb} />