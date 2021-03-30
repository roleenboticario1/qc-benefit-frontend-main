import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { logout } from 'react-formio';
import { useAuth } from '../../modules/auth';

const Header = () => {
  const { state: authState, dispatch } = useAuth();

  const onLogout = () => {
    logout()(dispatch);
  };

  return (

     <div className="row">
        <NavLink className="btn btn-info" to="/">
           <b height="15px">HIDE FORMBUILDER</b>
        </NavLink>
        <div className="">
            {  authState.authenticated  ? (
              <NavLink to="/form" className="btn btn-info" >
                <i className="fa fa-wpforms"></i>&nbsp;
                Forms
              </NavLink>
            ) : null }
            { authState.authenticated ? (
                <span className="btn btn-info" onClick={onLogout}>
                  <span className="fa fa-sign-out" />&nbsp;
                  Logout
                </span>
            ) : (
              <NavLink to="/auth"  className="btn btn-info">
                 <b height="15px">SHOW FORMBUILDER</b>
              </NavLink>
            )}
        </div>
      </div>
  );
};

export default Header;


// // // //eto talaga original binago ko lang need pa kase mag login dito at register
// import React from 'react';
// import { NavLink, Link } from 'react-router-dom';
// import { logout } from 'react-formio';
// import { useAuth } from '../../modules/auth';

// const Header = () => {
//   const { state: authState, dispatch } = useAuth();

//   const onLogout = () => {
//     logout()(dispatch);
//   };

//   return (
//      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//         <div className="container">
//           <Link className="navbar-brand" to="/">
//             <b height="25px">FORMBUILDER</b>
//           </Link>
//           <ul className="nav navbar-nav mr-auto">
//             <NavLink exact to="/" role="navigation button" className="nav-link">
//               <span className="fa fa-home" />
//             </NavLink>
//             {  authState.authenticated  ? (
//               <NavLink to="/form" role="navigation link" className="nav-link">
//                 <i className="fa fa-wpforms"></i>&nbsp;
//                 Forms
//               </NavLink>
//             ) : null }
//           </ul>
//           <ul className="nav navbar-nav ml-auto">
//             { authState.authenticated ? (
//               <li className="nav-item">
//                 <span className="nav-link" role="navigation link" onClick={onLogout}>
//                   <span className="fa fa-sign-out" />&nbsp;
//                   Logout
//                 </span>
//               </li>
//             ) : (
//               <NavLink to="/auth" role="navigation link" className="nav-link">
//                 Login | Register
//               </NavLink>
//             )}
//           </ul>
//         </div>
//       </nav>
//   );
// };

// export default Header;


