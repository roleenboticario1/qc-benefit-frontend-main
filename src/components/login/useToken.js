import { useState } from 'react';

export default function useToken() {

  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken   = JSON.parse(tokenString);
    return userToken;
  };

  const getRole = () => {
    const roleString = localStorage.getItem('role');
    const userRole   = JSON.parse(roleString);
    return userRole;
  };

  const [token, setToken] = useState(getToken());
  const [role, setRole]   = useState(getRole());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  const saveRole = userRole => {
    localStorage.setItem('role', JSON.stringify(userRole));
    setRole(userRole.role);
  };

  return {
    setToken: saveToken,
    setRole: saveRole,
    token,
    role
  }
}
