import React, { Component } from "react";
import TransactionDataService from "../../services/transaction.service";
import { Link } from "react-router-dom";

import { Container, Box, Card, Typography, CardContent, CardActions } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import TablePagination from '@material-ui/core/TablePagination';


export default class TransactionsList extends Component {
  constructor(props) {
    super(props);
    this.retrieveTransactions    = this.retrieveTransactions.bind(this);
    this.setActiveTransaction    = this.setActiveTransaction.bind(this);
    this.handleChangePage        = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleSearch            = this.handleSearch.bind(this);
  

    this.state = {
      transactions      : [],
      currentTransaction: null,
      currentIndex      : -1,
      page: 0,
      limit: 10,
      max: 1000,
      searchOpt: "",
    };
  }

  componentDidMount() {
    this.retrieveTransactions();
  }

  handleSearch(event){
    console.log("change search: " + event.target.value);
    this.setState({
      searchOpt: event.target.value
    });

    this.retrieveTransactions();
  }

  handleChangePage(event, newPage){
    console.log("change page" + newPage);
    this.setState({
      page: newPage
    });

    //this.retrieveTransactions();
  }

  handleChangeRowsPerPage(event){
    console.log("change rows");
    this.setState({
      page: 0,
      limit: event.target.value
    });

    this.retrieveTransactions();
  }

  retrieveTransactions() {
    TransactionDataService.getAll(this.state.page, this.state.limit, this.state.searchOpt)
      .then(response => {
        this.setState({
          transactions: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  setActiveTransaction(transaction, index) {
    this.setState({
      currentTransaction: transaction,
      currentIndex: index
    });
  }

  render() {
    const { transactions, currentTransaction, currentIndex } = this.state;

    return (
     <Box xs={12}>

        <h3 className="title col-md-8" >
          TRANSACTIONS
          <Link to={"/transactions/add"} className="btn btn-sm btn-danger float-right">
            Add
          </Link>
        </h3>

        <div className="list row">
          <div className="col-md-8">

            <Paper>
              <Container>
              <Box align='right'>
                <InputBase
                  placeholder="Search by ID or user"
                  inputProps={{ 'aria-label': 'Search by ID or user' }}
                  onChange={this.handleSearch}
                />
                <IconButton type="submit" aria-label="search" onClick={this.retrieveTransactions}>
                  <SearchIcon />
                </IconButton>
              </Box>
              </Container>
              <TableContainer>
                <Table size={"small"} stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell align="center">Approved</TableCell>
                      <TableCell align="center">Status</TableCell>                      
                      <TableCell align="center">Date</TableCell>                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions && transactions.map((transaction, index) => (
                      <TableRow className={(index === currentIndex ? "active" : "")} 
                      onClick={() => this.setActiveTransaction(transaction, index)} key={index}>
                        <TableCell component="th" scope="row">
                          {transaction.id}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {transaction.userIdno}
                        </TableCell>
                        
                        <TableCell component="th" scope="row" className={'text-center'}>
                          {transaction.approved ? "Approved" : "Pending"}
                        </TableCell>
                        <TableCell component="th" scope="row" className={'text-center'}>
                          {transaction.status ? "Complete" : "Incomplete"}
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={this.state.max}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                rowsPerPage={this.state.limit}
                rowsPerPageOptions={[]}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </div>
          <div className="col-md-4">
              {currentTransaction ? (
                <Card className={"cardDetails"}>
                  <CardContent>
                    <Typography className={"categoryTitle"} color="textSecondary" gutterBottom>
                      DETAILS
                    </Typography>
                    <Typography variant="h5" component="h2">
                      Ref# {currentTransaction.id}
                    </Typography>
                    
                    <Typography variant="body2" component="p">
                      BENEFICIARY: {currentTransaction.userIdno}
                    </Typography>                 
                    <Typography variant="body2" component="p">
                      AMOUNT: {currentTransaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}
                    </Typography>
                    <Typography variant="body2" component="p">
                      DATE: {new Date(currentTransaction.createdAt).toDateString()}
                    </Typography>
                    <Typography variant="body2" component="p">
                      DETAILS: {currentTransaction.details}
                    </Typography>
                  </CardContent>
                  <CardActions>
                      <Link to={"/transactions/" + currentTransaction.id + "/edit"} className={"text-right btn btn-info btn-sm mr-2"} >
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