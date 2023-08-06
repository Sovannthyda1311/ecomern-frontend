import React, { useState, useEffect } from "react";
import { Alert, Button, Col, Container, Row, Table } from "react-bootstrap";
import axios from "axios";
import "./CartPage.css";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const token = Cookies.get("jwt");

      if (!token) {
        console.error("User not logged in. Token not found.");
        return;
      }
      const response = await axios.get("http://localhost:8000/api/cart/find", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuantity = async (itemId, action) => {
    try {
      const token = Cookies.get("jwt");
      const response = await axios.patch(
        `http://localhost:8000/api/cart/${itemId}`,
        { action }, // Pass the action to the backend
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the cart state with the updated quantity from the response
      fetchData();
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      const token = Cookies.get("jwt");
      const response = await axios.delete(
        `http://localhost:8000/api/cart/${itemId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.Product.Price * item.Quantity,
      0
    );
  };

  const handleOrder = () => {
    const OrderDetail = cart.map((item) => ({
      productId: item.ProductId,
      quantity: item.Quantity,
    }));
    navigate("/order", { state: { OrderDetail } });
  };

  useEffect(() => {
    // Function to auto-close the alert after 3000 milliseconds (3 seconds)
    const autoCloseAlert = () => {
      setError(null);
    };

    // If error exists, set a timer to auto-close the alert
    if (error) {
      const timer = setTimeout(autoCloseAlert, 2000); // Adjust the delay as needed (in milliseconds)
      return () => clearTimeout(timer); // Clear the timer when the component unmounts
    }
  }, [error]);

  return (
    <Container style={{ minHeight: "95vh" }} className="cart-container">
      <Row>
        <Col>
          <h1 className="pt-2 h3">Shopping cart</h1>
          {cart.length === 0 && (
            <Alert variant="info">
              Shopping cart is empty. Add products to your cart
            </Alert>
          )}
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
        </Col>
        {cart.length > 0 && (
          <Col md={5}>
            <>
              <Table responsive="sm" className="cart-table">
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.ProductId}>
                      <td>&nbsp;</td>
                      <td>
                        {!isLoading && (
                          <i
                            onClick={() => handleRemoveFromCart(item.ProductId)}
                            className="fa fa-times"
                            style={{ marginRight: 10, cursor: "pointer" }}
                          ></i>
                        )}
                        <img
                          src={item.Product.image}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                          alt="Product"
                        />
                      </td>
                      <td>${item.Product.Price}</td>
                      <td>
                        <span className="quantity-indicator">
                          <i
                            className="fa fa-minus-circle"
                            onClick={() =>
                              handleQuantity(item.ProductId, "decrease")
                            }
                          ></i>
                          <span>{item.Quantity}</span>
                          <i
                            className="fa fa-plus-circle"
                            onClick={() =>
                              handleQuantity(item.ProductId, "increase")
                            }
                          ></i>
                        </span>
                      </td>
                      <td>${item.Product.Price * item.Quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <h3 className="h4 pt-4">Total: ${calculateTotalPrice()}</h3>
                <Button onClick={handleOrder} disabled={cart.length === 0}>
                  Order
                </Button>
              </div>
            </>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default CartPage;
