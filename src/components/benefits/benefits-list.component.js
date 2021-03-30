import React, { Component } from "react";
import BenefitDataService from "../../services/benefit.service";
import { Link } from "react-router-dom";

import { Box, Card, Typography, CardContent, CardActions } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


export default class BenefitsList extends Component {
  constructor(props) {
    super(props);
		this.retrieveBenefits = this.retrieveBenefits.bind(this);
		this.setActiveBenefit = this.setActiveBenefit.bind(this);

    this.state = {
			benefits      : [],
			currentBenefit: null,
			currentIndex  : -1,
			searchCode    : ""
    };
  }

  /**
   * Init
   * @return {[type]} [description]
   */
  componentDidMount() {
  	this.retrieveBenefits();
  }

  /**
   * Retrieve all benefits
   * @return {[type]} [description]
   */
  retrieveBenefits() {
    BenefitDataService.getAll()
      .then(response => {
        this.setState({
        	benefits: response.data
        });
      })
      .catch(e => {
      	console.log(e);
      });
  }

  /**
   * Set selected benefit
   * @param {[type]} benefit [description]
   * @param {[type]} index   [description]
   */
  setActiveBenefit(benefit, index) {
    this.setState({
      currentBenefit: benefit,
      currentIndex: index
    });
  }

  render() {
    const { benefits, currentBenefit, currentIndex } = this.state;

    return (
      <Box xs={12}>
        <h3 className={"title col-md-8"} >
          BENEFITS
          <Link to={"/benefits/add"} className={"btn btn-sm btn-danger float-right"}>
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
                      <TableCell>Name</TableCell>
                      <TableCell align={"center"}>Department</TableCell>
                      <TableCell align={"center"}>Category</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {benefits && benefits.map((benefit, index) => (
                      <TableRow className={ (index === currentIndex ? "active" : "") } onClick={() => this.setActiveBenefit(benefit, index)} key={index}>
                        <TableCell component={"th"} scope={"row"}>
                          {benefit.code}
                        </TableCell>
                        <TableCell component={"th"} scope={"row"}>
                          {benefit.name}
                        </TableCell>
                        <TableCell align={"center"}>
                          {benefit.department.code}
                        </TableCell>
                        <TableCell align={"center"}>
                          {benefit.category.name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
          <div className={"col-md-4"}>
              {currentBenefit ? (
                <Card className={"cardDetails"}>
                  <CardContent>
                    <Typography className={"categoryTitle"} color={"textSecondary"} gutterBottom>
                      DETAILS
                    </Typography>
                    <Typography variant={"h5"} component={"h2"}>
                      {currentBenefit.name}
                    </Typography>
                    
                    <Typography variant={"body2"} component={"p"}>
                      Department: {currentBenefit.department.code}
                    </Typography>
                    <Typography variant={"body2"} component={"p"}>
                      Category: {currentBenefit.category.name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                      <Link to={"/benefits/" + currentBenefit.id} className={"text-right btn btn-info btn-sm mr-2"} >
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