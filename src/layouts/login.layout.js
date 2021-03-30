import React, { useState } from "react";
import PropTypes from 'prop-types';

import UserDataService from "../services/user.service";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useSnackbar } from "notistack";

import "../assets/css/login.css";

export default function Login({setToken, setRole}) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    
    event.preventDefault();
    let options = {
      email   : email,
      password: password
    };
    UserDataService.login(options)
      .then(response => {
        enqueueSnackbar("Success, logging in..", {variant: "success"});
        console.log(response.data);
        setToken(response.data.token);
        setRole(response.data.role);
        
        // TODO:  i can't make it to refersh the page :(
        window.location.reload(false);
      })
      .catch(e => {
        enqueueSnackbar("Error on logging in", {variant: "error"});
        console.log("Error on logging in");
      });
  }

  return (
    <div className={"Login"}>
      <Form onSubmit={handleSubmit}>        
        <h3>QC-SSDD Benefit Tracker</h3>
        <Form.Group size={"lg"} controlId={"email"}>
          <Form.Label>Email</Form.Label>
          <Form.Control autoFocus type={"email"} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group size={"lg"} controlId={"password"}>
          <Form.Label>Password</Form.Label>
          <Form.Control type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button block size={"lg"} type={"submit"} disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}