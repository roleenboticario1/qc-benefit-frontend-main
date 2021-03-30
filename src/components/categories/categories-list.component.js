import React, { Component } from "react";
import CategoryDataService from "../../services/category.service";
import { Link } from "react-router-dom";

import { Box, Card, Typography, CardContent, CardActions } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class CategoriesList extends Component {
  constructor(props) {
    super(props);
    this.retrieveCategories = this.retrieveCategories.bind(this);
    this.setActiveCategory  = this.setActiveCategory.bind(this);

    this.state = {
      categories     : [],
      currentCategory: null,
      currentIndex   : -1,
    };
  }

  /**
   * init
   * @return {[type]} [description]
   */
  componentDidMount() {
    this.retrieveCategories();
  }

  /**
   * Retrieve all categories
   * @return {[type]} [description]
   */
  retrieveCategories() {
    CategoryDataService.getAll()
      .then(response => {
        this.setState({
          categories: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  /**
   * Select category
   * @param {[type]} category [description]
   * @param {[type]} index    [description]
   */
  setActiveCategory(category, index) {
    this.setState({
      currentCategory: category,
      currentIndex   : index
    });
  }

  render() {
    const { categories, currentCategory, currentIndex } = this.state;

    return (
      <Box xs={12}>
        <h3 className="title col-md-8" >
          CATEGORIES
          <Link to={"/categories/add"} className="btn btn-sm btn-danger float-right">
            Add
          </Link>
        </h3>
        <div className={"list row"}>
          <div className={"col-md-8"}>  
            <Paper>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories && categories.map((category, index) => (
                      <TableRow className={ (index === currentIndex ? "active" : "") } onClick={() => this.setActiveCategory(category, index)} key={index}>
                        <TableCell>{category.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
          <div className="col-md-4">
              {currentCategory ? (
                <Card className={"cardDetails"}>
                  <CardContent>
                    <Typography className={"categoryTitle"} color="textSecondary" gutterBottom>
                      DETAILS
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {currentCategory.name}
                    </Typography>
                    
                    <Typography variant="body2" component="p">
                      
                    </Typography>
                  </CardContent>
                  <CardActions>
                      <Link to={"/categories/" + currentCategory.id} className={"text-right btn btn-info btn-sm mr-2"} >
                        Edit
                      </Link>
                  </CardActions>
                </Card>
              ) : (
                <div>
                  <br />
                </div>
              )}
          </div>            
        </div>
      </Box>
    );
  }
}