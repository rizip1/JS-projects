import React from 'react';
import {
  Navbar,
  Nav
} from 'react-bootstrap';
import { Link } from 'react-router';

import LoginForm from './LoginForm';
import UserActions from './UserActions';

const Navigation = ({ authenticated, handleSubmitLogin, logout }) => {
  return (
    <Navbar style={navigationStyle} inverse>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to={'/'}>Greetingtor</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          {authenticated && <UserActions logout={logout} /> || 
          <LoginForm onSubmit={handleSubmitLogin}/>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const navigationStyle = {
  borderRadius: 0,
  margin: 0
};

export default Navigation;
