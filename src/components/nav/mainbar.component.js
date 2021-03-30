import React from "react";
import { Switch, Route } from "react-router-dom";

import AddDepartment from "../../components/departments/add-department.component";
import Department from "../../components/departments/department.component";
import DepartmentsList from "../../components/departments/departments-list.component";

import AddCategory from "../../components/categories/add-category.component";
import CategoriesList from "../../components/categories/categories-list.component";
import Category from "../../components/categories/category.component";

import AddBenefit from "../../components/benefits/add-benefit.component";
import Benefit from "../../components/benefits/benefit.component";
import BenefitsList from "../../components/benefits/benefits-list.component";

import AddTransaction from "../../components/transactions/add-transaction.component";
import EditTransaction from "../../components/transactions/edit-transaction.component";
import TransactionsList from "../../components/transactions/transactions-list.component";

import UserInfo from "../../components/users/user-info.component";

import Report from "../../components/reports/report.component";


export default function Mainbar(token){
    const sessRole  = token.token.role;

    return (
		<div id={"content"}>
		    <nav className={"navbar navbar-expand-lg navbar-light bg-light"}>
		        <div className={"container-fluid"}>
		            <button type="button" id={"sidebarCollapse"} className={"btn btn-info"}>
		                <i className={"fas fa-align-left"}></i>
		                <span>Toggle Sidebar</span>
		            </button>
		        </div>
		    </nav>

			<Switch>
				{/* eslint-disable-next-line  */}
				{sessRole == 1 &&
					<Route exact path="/departments" component={DepartmentsList} />
				}
				{/* eslint-disable-next-line  */}
				{sessRole == 1 &&
					<Route exact path="/departments/add" component={AddDepartment} />
				}
				{/* eslint-disable-next-line  */}
				{sessRole == 1 &&
					<Route path="/departments/:id" component={Department} />
				}

				{/* eslint-disable-next-line  */}
				{sessRole == 1 &&
					<Route exact path="/categories" component={CategoriesList} />
				}
				{/* eslint-disable-next-line  */}
				{sessRole == 1 &&				
					<Route exact path="/categories/add" component={AddCategory} />
				}
				{/* eslint-disable-next-line  */}
				{sessRole == 1 &&
					<Route path="/categories/:id" component={Category} />
				}
				{/* eslint-disable-next-line  */}
				{sessRole == 1 &&
					<Route path="/reports" component={Report} />				
				}

				{/* eslint-disable-next-line  */}
				{sessRole <= 2 &&
					<Route exact path="/benefits" component={BenefitsList} />
				}
				{/* eslint-disable-next-line  */}
				{sessRole <= 2 &&
					<Route exact path="/benefits/add" component={AddBenefit} />
				}
				{/* eslint-disable-next-line  */}
				{sessRole <= 2 &&
					<Route path="/benefits/:id" component={Benefit} />
				}

				{/* eslint-disable-next-line  */}
				{sessRole <= 8 &&
					<Route exact path="/transactions" component={TransactionsList} />
				}
				{/* eslint-disable-next-line  */}
				{sessRole <= 8 &&
					<Route exact path="/transactions/add" component={AddTransaction} />
				}
				{/* eslint-disable-next-line  */}
				{sessRole <= 8 &&
					<Route exact path="/transactions/:id/edit" component={EditTransaction} />
				}

				<Route exact path="/users" component={UserInfo} />

			</Switch>
		</div>			
    )
}

