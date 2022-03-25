import React, {useState, useEffect} from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, Card, CardBody, CardHeader,CardFooter } from 'reactstrap';
import DashboardLayout from '../../layouts/DashboardLayout';
import { BrowserRouter as Router, withRouter, Route,Redirect,Switch } from 'react-router-dom';

const cardStyle = {
  width:"50%",
  textAlign:'center',
  margin:'0 auto',
  color:'blue',
}

const appStyle = {
}

const LoginPage = () => {
  
  async function submitForm() {
    alert("submit form!!!");
    return <Redirect to={{ pathname: '/home', state: {flag: true}}} />
  }
  
  return (
    <div style={appStyle}>
    <Card style={cardStyle}>
    <CardHeader>
      CMS
    </CardHeader>
    </Card>
      <Form onSubmit={submitForm}>
  <FormGroup className="mb-2 me-sm-2 mb-sm-0">
    <Label
      className="me-sm-2"
      for="exampleEmail"
    >
      Email
    </Label>
    <Input
      id="exampleEmail"
      name="email"
      placeholder="something@idk.cool"
      type="email"
    />
  </FormGroup>
  <FormGroup className="mb-2 me-sm-2 mb-sm-0">
    <Label
      className="me-sm-2"
      for="examplePassword"
    >
      Password
    </Label>
    <Input
      id="examplePassword"
      name="password"
      placeholder="don't tell!"
      type="password"
    />
  </FormGroup>
  <Button>
    Submit
  </Button>
</Form>
    </div>
  );
};

export default withRouter(LoginPage);
