// CheckoutForm.js
import React, { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutForm.css"; // Import the custom CSS file
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";

function CheckoutForm() {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const location = useLocation();
  const [phonenumber, setphonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);
  const OrderDetails = location.state.OrderDetail;
  async function handlePay(e) {
    e.preventDefault();
    const token = Cookies.get("jwt");
    try {
      await axios.post(
        "http://localhost:8000/api/order",
        {
          email,
          address,
          phonenumber,
          OrderDetails,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("🦄 Your Order is Succesfull, We will contact you soon!", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      window.location.href = "/";
    } catch (error) {
      // Handle error
    }
  }

  return (
    <div className="form-container">
      <Col className="cart-payment-container">
        <Form onSubmit={handlePay}>
          <Row>
            <Col md={7}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Phonenumber</Form.Label>
                <Form.Control
                  placeholder="Phonenumber"
                  required
                  value={phonenumber}
                  onChange={(e) => setphonenumber(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Add Stripe CardElement and other payment-related components here */}
          {/* ... */}
          <Button type="submit">Place Order</Button>
        </Form>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Col>
    </div>
  );
}

export default CheckoutForm;
