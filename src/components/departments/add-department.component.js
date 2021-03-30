import React, { Component } from "react";
import DepartmentDataService from "../../services/department.service";
import {Container, Paper} from '@material-ui/core';
import { Link } from "react-router-dom";
import { withSnackbar } from "notistack";

class AddDepartment extends Component {
  constructor(props) {
    super(props);
    this.onChangeCode   = this.onChangeCode.bind(this);
    this.onChangeName   = this.onChangeName.bind(this);
    this.saveDepartment = this.saveDepartment.bind(this);
    this.newDepartment  = this.newDepartment.bind(this);

    this.state = {
      id  : null,
      code: "",
      name: "",
      submitted: false
    };
  }

  onChangeCode(e) {
    this.setState({
      code: e.target.value
    });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  saveDepartment(event) {
    event.preventDefault();
    var data = {
      code: this.state.code,
      name: this.state.name
    };

    DepartmentDataService.create(data)
      .then(response => {
        this.setState({
          id       : response.data.id,
          code     : response.data.code,
          name     : response.data.name,
          submitted: true
        });
        this.props.enqueueSnackbar('Successfully created.', {variant: "success"});
      })
      .catch(e => {
        this.props.enqueueSnackbar('Something went wrong.', {variant: "error"});
        console.log(e);
      });
  }

  newDepartment() {
    this.setState({
      id  : null,
      code: "",
      name: "",
      submitted: false
    });
  }

  render() {
    return (
      <Container>
        <h4 className={"title col-md-8"}>
          New Department
        </h4>
        <Paper className={"col-xs-6"}>
          <Container className={"submit-form"}>
            {this.state.submitted ? (
              <div>
                <br/>
                <h5>{this.state.name} was created!</h5>
                <button className={"btn btn-success"} onClick={this.newDepartment}>
                  Add new department again?
                </button>
                <Link to={"/departments"} className={"btn btn-primary"}>
                  Go to Departments
                </Link>
              </div>
            ) : (
              <div>
                <br/>
                <div className={"form-group"}>
                  <label htmlFor={"code"}>Code</label>
                  <input type={"text"} className={"form-control"} id={"code"} value={this.state.code} onChange={this.onChangeCode} name={"code"} required />
                </div>
                <div className={"form-group"}>
                  <label htmlFor={"name"}>Name</label>
                  <input type={"text"} className={"form-control"} id={"name"} required value={this.state.name} onChange={this.onChangeName} name={"name"} />
                </div>
                <Link to={"/departments"} className={"btn btn-default"}>
                  Cancel
                </Link>
                <button onClick={this.saveDepartment} className={"btn btn-success mr-2"}>
                  Submit
                </button>           
              </div>
            )}
          </Container>
        </Paper>
      </Container>      
    );
  }
}

export default withSnackbar(AddDepartment);
