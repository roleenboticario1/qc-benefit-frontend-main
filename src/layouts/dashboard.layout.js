import React from "react";

import MainBar from "../components/nav/mainbar.component";
import SideBar from "../components/nav/sidebar.component";

export default function Dashboard(token) {
    return ( 
    	<div className={"wrapper"}>
    		<SideBar token={token} />
    		<MainBar token={token} />
    	</div> 
    );
}