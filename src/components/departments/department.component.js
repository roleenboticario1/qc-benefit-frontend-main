import React, { Component } from "react";
import DepartmentDataService from "../../services/department.service";
import { Link } from "react-router-dom";
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import { withSnackbar } from "notistack";

class Department extends Component {
  constructor(props) {
    super(props);

    this.onChangeCode     = this.onChangeCode.bind(this);
    this.onChangeName     = this.onChangeName.bind(this);
    this.getDepartment    = this.getDepartment.bind(this);
    this.updateDepartment = this.updateDepartment.bind(this);
    this.deleteDepartment = this.deleteDepartment.bind(this);

    this.state = {
      currentDepartment: {
        id  : null,
        code: "",
        name: "",
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getDepartment(this.props.match.params.id);
  }

  onChangeCode(e) {
    const code = e.target.value;

    this.setState(function(prevState) {
      return {
        currentDepartment: {
          ...prevState.currentDepartment,
          code: code
        }
      };
    });
  }

  onChangeName(e) {
    const name = e.target.value;
    
    this.setState(prevState => ({
      currentDepartment: {
        ...prevState.currentDepartment,
        name: name
      }
    }));
  }

  getDepartment(id) {
    DepartmentDataService.get(id)
      .then(response => {
        this.setState({
          currentDepartment: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateDepartment(e) {
    e.preventDefault();
    DepartmentDataService.update(
      this.state.currentDepartment.id,
      this.state.currentDepartment
    )
      .then(response => {
        //console.log(response.data);
        this.props.enqueueSnackbar('Successfully updated.', {variant: "success"});
        // this.setState({
        //   message: "The department was updated successfully!"
        // });
      })
      .catch(err => {
        this.props.enqueueSnackbar('Something went wrong.', {variant: "error"});
        console.log(err);
      });
  }

  deleteDepartment(e) {
    e.preventDefault();
    if(window.confirm("Delete this item?")){
        DepartmentDataService.delete(this.state.currentDepartment.id)
          .then(response => {
            console.log("IAMHERE");
            this.props.enqueueSnackbar('Successfully deleted.', {variant: "success"});
            
            this.props.history.push('/departments');
            //return false;
          })
          .catch(err => {
            console.log(err);
          });
    }
  }

  render() {
    const { currentDepartment } = this.state;

    return (
      <div>
        {currentDepartment ? (
          <Container>
            <h4 className={"title col-md-8"} >
              Update Department
            </h4>
            <Paper>
              <Container className={"edit-form"}>
                <form>
                  <br/> 
                  <div className={"form-group"}>
                    <label htmlFor="code">Code</label>
                    <input type={"text"} className={"form-control"} id={"code"} value={currentDepartment.code} onChange={this.onChangeCode} />
                  </div>
                  <div className={"form-group"}>
                    <label htmlFor={"name"}>Description</label>
                    <input type={"text"} className={"form-control"} id={"name"} value={currentDepartment.name} onChange={this.onChangeName} />
                  </div>
                  <button className={"btn btn-danger mr-2"} onClick={this.deleteDepartment} >
                    Delete
                  </button>
                  <button type={"submit"} className={"btn float-right btn-success"} onClick={this.updateDepartment} >
                    Update
                  </button>
                  <Link to={"/departments"} className={"btn float-right btn-default"}>
                    Cancel
                  </Link>

                </form>
              </Container>
            </Paper>
          </Container>         
        ) : (
          <div>
            <br />
          </div>
        )}
      </div>
    );
  }
}

export default withSnackbar(Department);
