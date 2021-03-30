import React, { Component } from "react";
import ReportDataService from "../../services/report.service";

import { Grid, Box, TextField, NativeSelect, FormControl, InputLabel, Button } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { withSnackbar } from "notistack";

class Report extends Component {
  	constructor(props) {
    	super(props);

		this.handleReport   = this.handleReport.bind(this);
		this.getPerDay = this.getPerDay.bind(this);
		this.changeReportType = this.changeReportType.bind(this);

		this.state = {
			dateFrom  : "",
			dateTo    : "",
			reportType: "all",
			approve   : -1,
			status    : -1,
			total     : 0,
			totalArray: [],
			dailyData : [],
			summary   : 0
		}
		
	}

	changeReportType(e){
		this.setState({ 
			reportType: e.target.value, 
			dailyData: [],
			totalArray: [],
			total: 0,
		});
	}

	handleReport(){
		console.log("Click report");

		this.setState({ 
			dailyData: [],
			totalArray: [],
			total: 0
		});


		if(!this.state.dateFrom){
			let date2 = new Date();
			let date1 = new Date();
			date1.setDate(date2.getDate() - 1);
			console.log(date2);
			console.log(date1);
			this.setState({
				dateFrom: date1.toLocaleString(),
				dateTo: date2.toLocaleString()
			});
		}

		console.log(this.state.dateFrom);
		console.log(this.state.dateTo);

		switch( this.state.reportType ){
			case "dept": 
				this.getCountPerDepartment();				
				break;
			case "cate":
				this.getCountPerCategory();
				break;
			case "bene":
				this.getCountPerBenefit();
				break;
			default:
				this.getPerDay();
				break;
		}
	}

	getPerDay(){ 
		console.log("get per day");
		console.log(this.state.reportType);
		let options = {
			dateFrom: this.state.dateFrom,
			dateTo  : this.state.dateTo,
			status  : this.state.status,
			approve : this.state.approve,
			summary : this.state.summary
		};
		ReportDataService.getCountPerDay(options)
			.then(response => {
				let dataArray = []; //{date: 1, total: 2}, {date: 2, total: 2}];
				for(let a in response.data.daily){
					dataArray.push({date: a, total: response.data.daily[a] });
				}

				console.log(dataArray);
				this.setState({
					total: response.data.total,
					dailyData: dataArray
				});

				this.props.enqueueSnackbar('Data updated.', {variant: "success"});

			})
			.catch(e => {
				console.log(e);
				this.props.enqueueSnackbar('Something went wrong.', {variant: "error"});
			})
	}

	getCountPerBenefit(){ 
		console.log("get per benefit");
		let options = {
			dateFrom: this.state.dateFrom,
			dateTo  : this.state.dateTo,
			status  : this.state.status,
			approve : this.state.approve,
			summary : this.state.summary
		};
		ReportDataService.getTotaCountPerBenefit(options)
			.then(response => {
				let dataArray = []; //{date: 1, total: 2}, {date: 2, total: 2}];
				
				for(let a in response.data.daily){
					let arrayOfDivision = [];
					for(let category in response.data.daily[a]){
						arrayOfDivision.push({category: category, value: response.data.daily[a][category]});
					}
					dataArray.push({date: a, total: arrayOfDivision });
				}

				let totalArray = [];
				console.log(response.data.total);
				for(let a in response.data.total){
				 	totalArray.push({ category: a, value: response.data.total[a] });
				}

				console.log(totalArray);
				this.setState({
					totalArray: totalArray,
					dailyData : dataArray
				});

				this.props.enqueueSnackbar('Data updated.', {variant: "success"});

			})
			.catch(e => {
				console.log(e);
				this.props.enqueueSnackbar('Something went wrong.', {variant: "error"});
			})
	}

	getCountPerCategory(){ 
		console.log("get per Category");
		let options = {
			dateFrom: this.state.dateFrom,
			dateTo  : this.state.dateTo,
			status  : this.state.status,
			approve : this.state.approve,
			summary : this.state.summary
		};
		ReportDataService.getTotalCountPerCategory(options)
			.then(response => {
				let dataArray = []; //{date: 1, total: 2}, {date: 2, total: 2}];
				
				for(let a in response.data.daily){
					let arrayOfDivision = [];
					for(let category in response.data.daily[a]){
						arrayOfDivision.push({category: category, value: response.data.daily[a][category]});
					}
					dataArray.push({date: a, total: arrayOfDivision });
				}

				let totalArray = [];
				console.log(response.data.total);
				for(let a in response.data.total){
				 	totalArray.push({ category: a, value: response.data.total[a] });
				}

				console.log(totalArray);
				this.setState({
					totalArray: totalArray,
					dailyData : dataArray
				});

				this.props.enqueueSnackbar('Data updated.', {variant: "success"});

			})
			.catch(e => {
				console.log(e);
				this.props.enqueueSnackbar('Something went wrong.', {variant: "error"});
			})
	}

	getCountPerDepartment(){ 
		console.log("get per Department");
		let options = {
			dateFrom: this.state.dateFrom,
			dateTo  : this.state.dateTo,
			status  : this.state.status,
			approve : this.state.approve,
			summary : this.state.summary
		};
		ReportDataService.getTotaCountPerDepartment(options)
			.then(response => {
				let dataArray = []; //{date: 1, total: 2}, {date: 2, total: 2}];
				
				for(let a in response.data.daily){
					let arrayOfDivision = [];
					for(let category in response.data.daily[a]){
						arrayOfDivision.push({category: category, value: response.data.daily[a][category]});
					}
					dataArray.push({date: a, total: arrayOfDivision });
				}

				let totalArray = [];
				console.log(response.data.total);
				for(let a in response.data.total){
				 	totalArray.push({ category: a, value: response.data.total[a] });
				}

				console.log(totalArray);
				this.setState({
					totalArray: totalArray,
					dailyData : dataArray
				});

				this.props.enqueueSnackbar('Data updated.', {variant: "success"});

			})
			.catch(e => {
				console.log(e);
				this.props.enqueueSnackbar('Something went wrong.', {variant: "error"});
			})
	}


	render(){
		return (
			<Grid container spacing={2}>
				<Grid item xs={12} sm={3}>
					<TextField id={"datefrom"} label={"Date From"} type={"date"}
						className={"datefrom"} InputLabelProps={{ shrink: true, }} 
						onChange={(e) => this.setState({ dateFrom: e.target.value })}
						/>
					<br/><br/>
					<TextField id={"dateto"} label={"Date To"} type={"date"}
						className={"dateto"} InputLabelProps={{ shrink: true, }} 
						onChange={(e) => this.setState({ dateTo: e.target.value })}
						/>
					<br/><br/>
  					<FormControl className={"reporTypeForm"}>
    					<InputLabel shrink htmlFor={"reportType"}>
      						Report type
    					</InputLabel>
    					<NativeSelect inputProps={{ name: 'reportType', id: 'reportType' }}
    						onChange={this.changeReportType}>
      						<option value={"all"}>All</option>
      						<option value={"dept"}>Per Department</option>
      						<option value={"cate"}>Per Category</option>
      						<option value={"bene"}>Per Benefit</option>
    					</NativeSelect>
  					</FormControl>
  					<br/><br/>
  					<FormControl className={"statusForm"}>
    					<InputLabel shrink htmlFor={"status"}>
      						Status
    					</InputLabel>
    					<NativeSelect inputProps={{ name: 'status', id: 'status' }}
    						onChange={(e) => this.setState({ status: e.target.value })}>
      						<option value={-1}>All</option>
      						<option value={1}>Complete</option>
      						<option value={0}>Incomplete</option>
    					</NativeSelect>
  					</FormControl>
  					<br/><br/>
  					<FormControl className={"approvedForm"}>
    					<InputLabel shrink htmlFor={"approved"}>
      						Approval
    					</InputLabel>
    					<NativeSelect inputProps={{ name: 'approved', id: 'approved' }}
    						onChange={(e) => this.setState({ approve: e.target.value })}>
      						<option value={-1}>All</option>
      						<option value={1}>Approved</option>
      						<option value={0}>Pending</option>
    					</NativeSelect>
  					</FormControl>
					<br/><br/>
  					<FormControl className={"approvedForm"}>
    					<InputLabel shrink htmlFor={"approved"}>
      						Summary
    					</InputLabel>
    					<NativeSelect inputProps={{ name: 'summary', id: 'summary' }}
    						onChange={(e) => this.setState({ summary: e.target.value })}>
      						<option value={0}>Total Count</option>
      						<option value={1}>Total Amount</option>      						
    					</NativeSelect>
  					</FormControl>
					<br/><br/>
  					<Button className={"btn-block"} variant="contained" color="secondary" onClick={this.handleReport}>
					  Apply
					</Button>
				</Grid>
				
				<Grid item xs={12} sm={9}>
					<Paper>
						<Box>
	              			<TableContainer>
	                			<Table stickyHeader>
	                  				<TableHead>
	                    				<TableRow>
											<TableCell>Date</TableCell>
											{/* eslint-disable-next-line  */}
                  							{this.state.reportType == "all" &&
                  								<TableCell>Count</TableCell>
                  							}
                  							{/* eslint-disable-next-line  */}
                  							{this.state.reportType != "all" && 
                  								<TableCell align={"left"}>
              										<Grid container spacing={3}>
                  										<Grid item xs={6} sm={6}>Category</Grid>
                  										<Grid item xs={6} sm={6}><span className="spanRight">Count</span></Grid>
              										</Grid>
                  								</TableCell>
                  							}
	                    				</TableRow>
	                  				</TableHead>
	                  				<TableBody>
	                  					{this.state.dailyData && this.state.dailyData.map((data,index) => (
	                  						<TableRow key={`row${index}`}>
	                  							<TableCell key={data.date} align={"center"}>{data.date}</TableCell>
	                  							
	                  							{/* eslint-disable-next-line  */}
	                  							{this.state.reportType == "all" &&
	                  								<TableCell align={"right"}>{data.total.toLocaleString()}</TableCell>
	                  							}

	                  							{/* eslint-disable-next-line  */}
	                  							{this.state.reportType != "all" && 
	                  								<TableCell align={"left"}>
	                  									{data.total.map((category, index) => (
	                  										<Grid container spacing={3} key={`${category}-${index}`}>
		                  										<Grid item xs={6} sm={6}>{category.category}</Grid>
		                  										<Grid item xs={6} sm={6}>
		                  											<span className="spanRight">
		                  												{category.value.toLocaleString()}
		                  											</span>
		                  										</Grid>
	                  										</Grid>
	                  									))}
	                  								</TableCell>
	                  							}
	                  						</TableRow>
		                  				))}
	                  					
		                  				<TableRow>
		                  					<TableCell align={"center"}> Total  </TableCell>
	                  						{/* eslint-disable-next-line  */}
                  							{this.state.reportType == "all" &&
                  								<TableCell align={"right"}> {this.state.total.toLocaleString()}  </TableCell>
                  							}
		                  					

                  							{/* eslint-disable-next-line  */}
                  							{this.state.reportType != "all" && 
                  								<TableCell align={"left"}>
                  									{this.state.totalArray.map((category, index) => (
                  										<Grid container spacing={3} key={`${category}-${index}`}>
	                  										<Grid item xs={6} sm={6}>{category.category}</Grid>
	                  										<Grid item xs={6} sm={6}>
	                  											<span className="spanRight">
	                  												{category.value.toLocaleString()}
	                  											</span>
	                  										</Grid>
                  										</Grid>
                  									))}
                  								</TableCell>
                  							}
				                      	</TableRow>
	                  				</TableBody>
	                 			</Table>
	                 		</TableContainer>
						</Box>
					</Paper>
				</Grid>

			</Grid>
		);
	}
}

export default withSnackbar(Report);
