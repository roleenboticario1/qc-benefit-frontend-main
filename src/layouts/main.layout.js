import React from "react";

import Dashboard from "./dashboard.layout";
import Login from "./login.layout";
import useToken from '../components/login/useToken';

export default function Main() {
	const { token, setToken } = useToken();
	const { role, setRole }   = useToken();

	if(!token) {
		return <Login setToken={setToken} setRole={setRole} />
	}

    return (
	    <Dashboard token={token} role={role} />
    );
}