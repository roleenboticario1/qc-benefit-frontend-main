import React, { Component } from "react";
import DepartmentDataService from "../../services/department.service";
import { Link } from "react-router-dom";

import { Box, Card, Typography, CardContent, CardActions } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class DepartmentsList extends Component {
  constructor(props) {
    super(props);
    this.retrieveDepartments = this.retrieveDepartments.bind(this);
    this.setActiveDepartment = this.setActiveDepartment.bind(this);
    
    this.state = {
      departments      : [],
      currentDepartment: null,
      currentIndex     : -1,
      searchCode       : ""
    };
  }

  /**
   * Init
   * @return {[type]} [description]
   */
  componentDidMount() {
    this.retrieveDepartments();
  }

  /**
   * Retrieve all departments
   * @return {[type]} [description]
   */
  retrieveDepartments() {
    DepartmentDataService.getAll()
      .then(response => {
        this.setState({
          departments: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  /**
   * Select a department
   * @param {[type]} department [description]
   * @param {[type]} index      [description]
   */
  setActiveDepartment(department, index) {
    this.setState({
      currentDepartment: department,
      currentIndex: index
    });
  }

  render() {
    const { departments, currentDepartment, currentIndex } = this.state;

    return (
      <Box xs={12}>
        <h3 className={"title col-md-8"} >
          DEPARTMENTS
          <Link to={"/departments/add"} className={"btn btn-sm btn-danger float-right"}>
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
                      <TableCell>Code</TableCell>
                      <TableCell align={"center"}>Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departments && departments.map((department, index) => (
                      <TableRow className={ (index === currentIndex ? "active" : "") } onClick={() => this.setActiveDepartment(department, index)} key={index}>
                        <TableCell component={"th"} scope={"row"}>
                          {department.code}
                        </TableCell>
                        <TableCell align={"center"}>{department.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
          <div className={"col-md-4"}>
              {currentDepartment ? (
                <Card className={"cardDetails"}>
                  <CardContent>
                    <Typography className={"categoryTitle"} color={"textSecondary"} gutterBottom>
                      DETAILS
                    </Typography>
                    <Typography variant={"h5"} component={"h2"}>
                      {currentDepartment.code}
                    </Typography>
                    
                    <Typography variant={"body2"} component={"p"}>
                      {currentDepartment.name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                      <Link to={"/departments/" + currentDepartment.id} className={"text-right btn btn-info btn-sm mr-2"} >
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