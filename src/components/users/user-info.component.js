import React, { Component } from "react";

import TransactionDataService from "../../services/transaction.service";

import { Container, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { withSnackbar } from "notistack";

class UserInfo extends Component {
  	constructor(props) {
    	super(props);

		this.searchUser              = this.searchUser.bind(this);
		this.setActiveTransaction    = this.setActiveTransaction.bind(this);
		this.handleChangePage        = this.handleChangePage.bind(this);
		this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
		this.retrieveTransactions    = this.retrieveTransactions.bind(this);
	    this.setQcId = this.setQcId.bind(this);

	    this.state = {	
	      	user: {
				qcid       : "--",
				lastname   : "--",
				firstname  : "--",
				middlename : "--",
				birthdate  :  "YYYY-MM-DD",
				gender     : "M",
				email      : "--",
				mobile     : "--",
				nationality: "Filipino"
	      	},
			currentTransaction: null,
			page              : 0,
			limit             : 10,
			max               : 1000,
			transactions      : [],
			currentIndex      : -1,
			total             : 0,
			approved          : 0,
			status            : 0,
	    };
  	}


  	handleChangePage(event, newPage){
    	console.log("change page" + newPage);
    	this.setState({
      		page: newPage
    	});
    	this.retrieveTransactions();
  	}

	handleChangeRowsPerPage(event){
		console.log("change rows");
		this.setState({
			page: 0,
		  	limit: event.target.value
		});

		this.retrieveTransactions();
	}

	setActiveTransaction(transaction, index) {
		this.setState({
			currentTransaction: transaction,
			currentIndex: index
		});
	}

  	searchUser(){
  		console.log(this.state.user.qcid);

    	TransactionDataService.getAll(this.state.page, this.state.limit, this.state.user.qcid)
      		.then(response => {
        		this.setState({
          			transactions: response.data
        		});

        		console.log(response.data);
        		this.props.enqueueSnackbar('Data fetched.', {variant: "success"});
      		})
      		.catch(e => {
        		console.log(e);
        		this.props.enqueueSnackbar('Something went wrong.', {variant: "error"});
      		});
  	}

	retrieveTransactions() {
		TransactionDataService.getAll(this.state.page, this.state.limit, this.state.user.qcid)
		  	.then(response => {
		    	this.setState({
		      		transactions: response.data
			    });
			})
		  	.catch(e => {
		    	console.log(e);
		  	});
	}

	setQcId(e){
		this.setState(function(prevState) { 
			return { 
				user: { 
					...prevState.user,
					qcid: e.target.value 
				} 
			}; 
		});
	}


	render(){
		const { transactions, user, currentIndex, currentTransaction} = this.state;

		return(
			<div>
				<Grid container spacing={3}>
					<Grid item xs={7}>
						<Paper>
							
							<Container align='left'>
								<h4>USER INFO</h4>
								<br/>
								<Grid container spacing={3}>
						        	<Grid item xs={12}>
						        		<Container>
											<Grid container spacing={1}>
											  <Grid container item xs={4} spacing={3}>
											    <Typography>QCID No.</Typography>
											  </Grid>
											  <Grid container item xs={8} spacing={3}>
											    {user.qcid}
											  </Grid>
											</Grid>         		
						        		</Container>
						        	</Grid>
						        	<Grid item xs={12}>
						        		<Container>
											<Grid container spacing={1}>
											  <Grid container item xs={4} spacing={3}>
											    <Typography>NAME</Typography>
											  </Grid>
											  <Grid container item xs={8} spacing={3}>
											    {user.lastname}, {user.firstname} {user.middlename}
											  </Grid>
											</Grid>         		
						        		</Container>
						        	</Grid>
						        	<Grid item xs={12}>
						        		<Container>
											<Grid container spacing={1}>
											  <Grid container item xs={4} spacing={3}>
											    <Typography>BIRTHDATE</Typography>
											  </Grid>
											  <Grid container item xs={8} spacing={3}>
											    {user.birthdate}
											  </Grid>
											</Grid>         		
						        		</Container>
						        	</Grid>
						        	<Grid item xs={12}>
						        		<Container>
											<Grid container spacing={1}>
											  <Grid container item xs={4} spacing={3}>
											    <Typography>SEX</Typography>
											  </Grid>
											  <Grid container item xs={8} spacing={3}>
											    {user.gender}
											  </Grid>
											</Grid>         		
						        		</Container>
						        	</Grid>
						        	<Grid item xs={12}>
						        		<Container>
											<Grid container spacing={1}>
											  <Grid container item xs={4} spacing={3}>
											    <Typography>EMAIL</Typography>
											  </Grid>
											  <Grid container item xs={8} spacing={3}>
											    {user.email}
											  </Grid>
											</Grid>         		
						        		</Container>
						        	</Grid>
						        	<Grid item xs={12}>
						        		<Container>
											<Grid container spacing={1}>
											  <Grid container item xs={4} spacing={3}>
											    <Typography>MOBILE</Typography>
											  </Grid>
											  <Grid container item xs={8} spacing={3}>
											    {user.mobile}
											  </Grid>
											</Grid>         		
						        		</Container>
						        	</Grid>
						        	<Grid item xs={12}>
						        		<Container>
											<Grid container spacing={1}>
											  <Grid container item xs={4} spacing={3}>
											    <Typography>NATIONALITY</Typography>
											  </Grid>
											  <Grid container item xs={8} spacing={3}>
											    {user.nationality}
											  </Grid>
											</Grid>         		
						        		</Container>
						        	</Grid>
						        	<br/>
						        </Grid>
						        <br/>
					        </Container>
						</Paper>
					</Grid>
					<Grid item xs={5}>
						<Paper>
							<Container align='center'>
								<InputBase placeholder="Search by QC ID" 
									inputProps={{ 'aria-label': 'Search by QC ID' }} 
									onChange={this.setQcId} />
								<IconButton type="submit" aria-label="search" onClick={this.searchUser}> <SearchIcon /> </IconButton>
							</Container>
						</Paper>
						<br/>
					</Grid>
				</Grid>
				<br/>
				<br/>
				<Paper>
					<Grid container spacing={3}>
						<Grid item xs={8}>
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
												<TableCell component="th" scope="row"> {transaction.id} </TableCell>
												<TableCell component="th" scope="row"> {transaction.userIdno} </TableCell>
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

	              			{transactions &&
								<TablePagination
								component="div"
								count={this.state.max}
								page={this.state.page}
								onChangePage={this.handleChangePage}
								rowsPerPage={this.state.limit}
								rowsPerPageOptions={[]}
								onChangeRowsPerPage={this.handleChangeRowsPerPage}
								/>
	          				}
						</Grid>
						<Grid item xs={4}>
							{currentTransaction ? (
								<Card className={"cardDetails"}>
									<CardContent>
										<Typography className={"categoryTitle"} color="textSecondary" gutterBottom> DETAILS </Typography>
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
										<Link href={"/transactions/" + currentTransaction.id + "/edit"} className={"text-right btn btn-info btn-sm mr-2"} >
											Edit
										</Link>
									</CardActions>
								</Card>
							) : (
							<div>
								<br />
							</div>
							)}
						</Grid>
					</Grid>
				</Paper>
			</div>
		);
	}

}

export default withSnackbar(UserInfo);