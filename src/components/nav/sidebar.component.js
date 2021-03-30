import React from "react";
import { Link } from "react-router-dom";

import UserDataService from "../../services/user.service";

export default function Sidebar(token){
    const sessToken = token.token.token;
    const sessRole  = token.token.role;

    function onLogoutUser(e){
        console.log(sessToken);
        UserDataService.logout({token: sessToken})
            .then(data => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');

                // TODO:  i can't make it to refersh the page :(
                window.location.reload(false);

                console.log("logout");
            })
            .catch(err => {
                console.log(err);
                console.log("Could not logout");
            });
    }

    return (
        <nav id={"sidebar"}>
            
            <div className={"sidebar-header"}>
                <h3>
                    <Link to={"/"}>
                        QC-SSDD Benefit Tracker
                    </Link>
                </h3>
            </div>
            
            <ul className={"list-unstyled components"}> {/* eslint-disable-next-line  */}
                {sessRole == 1 &&
                    <li>
                        <Link to={"/departments"} className={"nav-link"}>
                            Departments
                        </Link>
                    </li>
                }{/* eslint-disable-next-line  */}
                {sessRole == 1 &&             
                    <li>
                        <Link to={"/categories"} className={"nav-link"}>
                            Categories
                        </Link>
                    </li>
                }
                {sessRole <= 2 &&
                    <li>
                        <Link to={"/benefits"} className={"nav-link"}>
                            Benefits
                        </Link>
                    </li>
                }
                <li>
                    <Link to={"/transactions"} className={"nav-link"}>
                        Transactions
                    </Link>
                </li>
            </ul>
            <ul className={"list-unstyled"}>
                <li>
                    <Link to={"/users"} className={"nav-link"}>
                        Users
                    </Link>
                </li>
                {/* eslint-disable-next-line  */}
                {sessRole == 1 &&
                    <li>
                        <Link to={"/reports"} className={"nav-link"}>
                            Reports
                        </Link>
                    </li>
                }{/* eslint-disable-next-line  */}
                <li>
                    <Link to={"/"} className={"nav-link"} onClick={onLogoutUser} >
                        Logout
                    </Link>
                </li>
            </ul>
        </nav>
    )
    
}
