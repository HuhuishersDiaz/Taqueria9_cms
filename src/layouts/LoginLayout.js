import React, { Component } from 'react';
<<<<<<< HEAD
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, Card, CardBody, CardHeader,CardFooter } from 'reactstrap';
import { BrowserRouter as Router, withRouter, Route,Redirect,Switch } from 'react-router-dom';
=======
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Col,
  Row,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from 'reactstrap';
import { BrowserRouter as Router, withRouter, Route, Redirect, Switch } from 'react-router-dom';
>>>>>>> master
import nav from '../_nav';
import routes from '../views';
import ContextProviders from '../vibe/components/utilities/ContextProviders';
import handleKeyAccessibility, { handleClickAccessibility } from '../vibe/helpers/handleTabAccessibility';

<<<<<<< HEAD

const cardStyle = {
    width:"50%",
    textAlign:'center',
    margin:'0 auto',
    color: 'blue',
}
const appStyle = {
    
}

export default class LoginLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    
    
    render() {
    
    async function submitForm() {
       
    window.location.href = "http://cms.etcmediasolutions.com";
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
        )
    }
}
=======
const cardStyle = {
  width: '50%',
  textAlign: 'center',
  margin: '0 auto',
  color: 'blue',
};

const appStyle = {};

export default class LoginLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    async function submitForm() {
      window.location.href = 'http://localhost';
    }

    return (
      <div style={appStyle}>
        <Card style={cardStyle}>
          <CardHeader>CMS</CardHeader>
        </Card>
        <Form onSubmit={submitForm}>
          <FormGroup className="mb-2 me-sm-2 mb-sm-0">
            <Label className="me-sm-2" for="exampleEmail">
              Email
            </Label>
            <Input id="exampleEmail" name="email" placeholder="something@idk.cool" type="email" />
          </FormGroup>
          <FormGroup className="mb-2 me-sm-2 mb-sm-0">
            <Label className="me-sm-2" for="examplePassword">
              Password
            </Label>
            <Input id="examplePassword" name="password" placeholder="don't tell!" type="password" />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </div>
    );
  }
}
>>>>>>> master
