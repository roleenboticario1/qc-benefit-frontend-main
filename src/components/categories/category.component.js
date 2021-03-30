import React, { Component } from "react";
import CategoryDataService from "../../services/category.service";

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { withSnackbar } from "notistack";
import { Link } from "react-router-dom";

class Category extends Component {
  constructor(props) {
    super(props);
    this.onChangeName     = this.onChangeName.bind(this);
    this.getCategory    = this.getCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);

    this.state = {
      currentCategory: {
        id         : null,
        name: "",
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getCategory(this.props.match.params.id);
  }

  onChangeName(e) {
    const name = e.target.value;
    
    this.setState(prevState => ({
      currentCategory: {
        ...prevState.currentCategory,
        name: name
      }
    }));
  }

  getCategory(id) {
    CategoryDataService.get(id)
      .then(response => {
        this.setState({
          currentCategory: response.data
        });
        //console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateCategory(e) {
    e.preventDefault();
    CategoryDataService.update(
      this.state.currentCategory.id,
      this.state.currentCategory
    )
      .then(response => {
        this.props.enqueueSnackbar('Successfully updated.', {variant: "success"});
      })
      .catch(err => {
        console.log(err);
      });
  }

  deleteCategory(e) {
    e.preventDefault();
    if(window.confirm("Delete this item?")){
      CategoryDataService.delete(this.state.currentCategory.id)
        .then(response => {
          this.props.enqueueSnackbar('Successfully deleted.', {variant: "success"});
          this.props.history.push('/categories')
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    const { currentCategory } = this.state;

    return (
      <div>
        {currentCategory ? (
          <Container>
            <h4 className={"title col-md-8"} >
              Update Category
            </h4>
            <Paper>
              <Container className={"edit-form"}>
                <form>
                  <br/>
                  <div className={"form-group"}>
                    <label htmlFor={"name"}>Name</label>
                    <input type={"text"} className={"form-control"} id={"name"} value={currentCategory.name} onChange={this.onChangeName} />
                  </div>
                  <button className={"btn btn-danger mr-2"} onClick={this.deleteCategory} >
                    Delete
                  </button>
                  <button type={"submit"} className={"btn float-right btn-success"} onClick={this.updateCategory} >
                    Update
                  </button>

                    <Link to={"/categories"} className={"btn float-right btn-default"}>
                      Cancel
                    </Link>

                </form>
              </Container>
            </Paper>
          </Container>         
        ) : (
          <div>
          </div>
        )}
      </div>
    );
  }
}

export default withSnackbar(Category);
