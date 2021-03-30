import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/material-dashboard.css?v=1.3.0";
import "./assets/css/custom.css";

import MainLayout from "./layouts/main.layout";

import * as serviceWorker from "./serviceWorker";
import { Route } from 'react-router-dom';

import { BrowserRouter as Router } from 'react-router-dom';


ReactDOM.render(	
  	<BrowserRouter basename={process.env.REACT_APP_SUBDIR}>
  		<SnackbarProvider maxSnack={2} anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}} transitionDuration={{ enter: 225, exit: 100 }} >
  			<MainLayout />
  			   
  		</SnackbarProvider>
  	</BrowserRouter>,
  	document.getElementById("root")
);

serviceWorker.unregister();


