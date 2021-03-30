import $ from "jquery";
import React, { Component, createRef } from "react";
import DepartmentDataService from "../../services/department.service";
import CategoryDataService from "../../services/category.service";
import BenefitDataService from "../../services/benefit.service";
import { withSnackbar } from "notistack";
import { Link } from "react-router-dom";

window.jQuery = $;
window.$ = $;

require("jquery-ui-sortable");
require("formBuilder");

class Benefit extends Component {

  constructor(props) {
    super(props);

    this.getDepartments       = this.getDepartments.bind(this);
    this.getCategories        = this.getCategories.bind(this);
    this.setCustomFields      = this.setCustomFields.bind(this);

    this.onChangeName         = this.onChangeName.bind(this);
    this.onChangeAutoApprove  = this.onChangeAutoApprove.bind(this);
    this.onChangeDepartmentId = this.onChangeDepartmentId.bind(this);
    this.onChangeCategoryId   = this.onChangeCategoryId.bind(this);
    this.onChangeCustomFields = this.onChangeCustomFields.bind(this);
    this.onClearCustomFields = this.onClearCustomFields.bind(this);
    
    this.getBenefit           = this.getBenefit.bind(this);
    this.updateBenefit        = this.updateBenefit.bind(this);
    this.deleteBenefit        = this.deleteBenefit.bind(this);

    this.fb            = createRef();
    this.thisFirstLoad = false;
    this.fbDom         = "";
    
    this.state = {
      currentBenefit: {
        id          : null,
        name        : "",
        departmentId: "",
        categoryId  : "",
        autoApprove : "",
        customFields: "",
      },
      message   : "",
      categories: [],
      departments: [],
      
    };
  }
  
  componentDidMount() {
    this.getBenefit(this.props.match.params.id);
    this.setCustomFields();
    this.getCategories();
    this.getDepartments();
  };

  /**
   * update render content done once
   * @return {[type]} [description]
   */
  componentDidUpdate(){
    try{
      if(!this.thisFirstLoad){
        console.log('Update data');
        this.fbDom.actions.setData(this.state.currentBenefit.customFields);
        this.thisFirstLoad = true;
      }
    } catch(e){
      console.log("fbdom not yet rendered");
    }
    console.log("data: " + this.state.currentBenefit.customFields);
  }

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
          //categories: [{id: '', name: '(Select category)'}].concat(categoriesApi)
          categories: categoriesApi
        });
        //console.log(response.data);
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
          departments: departmentsApi
        });
        //console.log(response.data);
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
      onClearAll      : this.onClearCustomFields,
      onCloseFieldEdit: this.onChangeCustomFields,
    };
    this.fbDom = $("#fb-editor").formBuilder(fbOptions);
  }

  onChangeDepartmentId(e) {
    const departmentId = e.target.value;
    console.log(departmentId);

    this.setState(function(prevState) {
      return {
        currentBenefit: {
          ...prevState.currentBenefit,
          departmentId: departmentId
        }
      };
    });
  }

  onChangeCategoryId(e) {
    const categoryId = e.target.value;

    this.setState(function(prevState) {
      return {
        currentBenefit: {
          ...prevState.currentBenefit,
          categoryId: categoryId
        }
      };
    });
  }


  onChangeAutoApprove(e) {
    var autoApprove = e.target.checked;
    console.log(autoApprove);

    this.setState(function(prevState) {
      return {
        currentBenefit: {
          ...prevState.currentBenefit,
          autoApprove: autoApprove
        }
      };
    });
  }

  onChangeCustomFields() {
    var customFields = this.fbDom.actions.getData();
    console.log("custom: " + customFields);
    this.setState(function(prevState) {
      return {
        currentBenefit: {
          ...prevState.currentBenefit,
          customFields: customFields
        }
      };
    });
  }

  onClearCustomFields() {
    this.setState(function(prevState) {
      return {
        currentBenefit: {
          ...prevState.currentBenefit,
          customFields: []
        }
      };
    });
  }

  onChangeName(e) {
    const name = e.target.value;
    
    this.setState(prevState => ({
      currentBenefit: {
        ...prevState.currentBenefit,
        name: name
      }
    }));
  }

  getBenefit(id) {
    BenefitDataService.get(id)
      .then(response => {
        this.setState({
          currentBenefit: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateBenefit(event) {
    event.preventDefault();
    BenefitDataService.update(
      this.state.currentBenefit.id,
      this.state.currentBenefit
    )
      .then(response => {
        this.props.enqueueSnackbar('Successfully updated.', {variant: "success"});
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteBenefit(event) {    
    event.preventDefault();
    if(window.confirm("Delete this item?")){
      BenefitDataService.delete(this.state.currentBenefit.id)
        .then(response => {
          this.props.enqueueSnackbar('Successfully deleted.', {variant: "success"});
          this.props.history.push('/benefits')
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  render() {
    const { currentBenefit } = this.state;

    return (
      <div>
        <div className="edit-form">
          <h4>Benefit</h4>
          <form>
            <div className="form-group">
              <label htmlFor="departmentId">Department</label>
              <select
                className="form-control"
                id="departmentId"
                value={currentBenefit.departmentId}
                onChange={this.onChangeDepartmentId}>
                {this.state.departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="categoryId">Category</label>
              <select
                className="form-control"
                id="categoryId"
                value={currentBenefit.categoryId}
                onChange={this.onChangeCategoryId}>
                {this.state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="name">Description</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={currentBenefit.name}
                onChange={this.onChangeName}
              />
            </div>
            <div className="form-group">
              <input type="checkbox"
                checked={currentBenefit.autoApprove}
                onChange={this.onChangeAutoApprove}
              />
              <label htmlFor="autoApprove">&nbsp;Auto-approved?</label>
            </div>
            <div className="form-group">
              <label htmlFor="name">Custom Fields</label>
              <div id="fb-editor" ref={this.fb} />
            </div>
          </form>

          <button className="btn btn-danger mr-2" onClick={this.deleteBenefit} >
            Delete
          </button>

          <button type="submit" className={"btn btn-info float-right"} onClick={this.updateBenefit} >
            Update
          </button>
          <Link to={"/benefits"} className={"btn btn-default float-right"}>
            Cancel
          </Link>
          <p>{this.state.message}</p>
        </div>
      </div>
    );
  }
}

export default withSnackbar(Benefit);