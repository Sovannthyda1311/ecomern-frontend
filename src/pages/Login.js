import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state variable for login status

  function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post("http://localhost:8000/api/user/login", { username, password })
      .then((response) => {
        Cookies.set("jwt", response.data.token, { expires: 3 });
        setIsLoading(false);
        setIsLoggedIn(true);
        window.location.href = "http://localhost:3000";
      })
      .catch((error) => {
        // Handle login error
        setIsLoading(false);
        setIsError(true);
        console.error("Login failed:", error);
      });
  }

  return (
    <Container>
      <Row>
        <Col md={6} className="login__form--container">
          <Form style={{ width: "100%" }} onSubmit={handleLogin}>
            <h1>Login to your account</h1>
            {isError && <Alert variant="danger">Login failed.</Alert>}
            {isLoggedIn && ( // Display success message if logged in
              <Alert variant="success">Login successful!</Alert>
            )}
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Button type="submit" disabled={isLoading}>
                Login
              </Button>
            </Form.Group>

            <p className="pt-3 text-center">
              Don't have an account? <Link to="/signup">Create account</Link>{" "}
            </p>
          </Form>
        </Col>
        <Col md={6} className="login__image--container"></Col>
      </Row>
    </Container>
  );
}

export default Login;
