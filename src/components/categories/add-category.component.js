import React, { Component } from "react";
import CategoryDataService from "../../services/category.service";

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import { Link } from "react-router-dom";

import { withSnackbar } from "notistack";

class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.onChangeName   = this.onChangeName.bind(this);
    this.saveCategory = this.saveCategory.bind(this);
    this.newCategory  = this.newCategory.bind(this);

    this.state = {
      id  : null,
      name: "",
      submitted: false
    };
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  saveCategory(e) {

    if(!this.state.name){
      this.props.enqueueSnackbar('Name could not be blank.', {variant: "warning"});
      return false;
    }
    e.preventDefault();
    var data = {
      name: this.state.name
    };


    CategoryDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          submitted: true
        });
        this.props.enqueueSnackbar('Successfully added.', {variant: "success"});
        console.log(response.data);
      })
      .catch(e => {
        this.props.enqueueSnackbar('Something went wrong.', {variant: "error"});
        console.log(e);
      });
  }

  newCategory() {
    this.setState({
      id  : null,
      name: "",
      submitted: false
    });
  }

  render() {
    return (

      <Container>
        <h4 className={"title col-md-8"} >
          New Category
        </h4>
        <Paper className={"col-xs-6"}>
          <Container className={"submit-form"}>
            {this.state.submitted ? (
              <div>
                <br/>
                <h5>{this.state.name} was created!</h5>
                <button className={"btn btn-success"} onClick={this.newCategory}>
                  Add new category again?
                </button>
                <Link to={"/categories"} className={"btn btn-primary"}>
                  Go to Categories
                </Link>
              </div>
            ) : (
              <div>
                <br/>
                <div className={"form-group"}>
                  <label htmlFor={"name"}>Name</label>
                  <input type={"text"} className={"form-control"} id={"name"} required value={this.state.name} onChange={this.onChangeName} name={"name"} />
                </div>

                <Link to={"/categories"} className={"btn btn-default"}>
                  Cancel
                </Link>
                <button onClick={this.saveCategory} className={"btn btn-success mr-2"}>
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

export default withSnackbar(AddCategory);
