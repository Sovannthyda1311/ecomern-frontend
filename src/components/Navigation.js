import axios from "../axios";
import React, { useRef, useState } from "react";
import { Navbar, Button, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Navigation.css";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
function Navigation() {
  const token = Cookies.get("jwt");
  const user = token ? jwtDecode(token) : null;
  const navagte = useNavigate();
  const handleLogout = () => {
    Cookies.remove("jwt");
    window.location.href = "http://localhost:3000/";
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Ecomern</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* if no user */}
            {!user ? (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            ) : (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            )}

            {/* Cart, Orders, and User navigation items */}
            <LinkContainer to="/cart">
              <Nav.Link>Cart</Nav.Link>
            </LinkContainer>

            {user && user.isAdmin && (
              <LinkContainer to="/admin">
                <Nav.Link>Dashboard</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
