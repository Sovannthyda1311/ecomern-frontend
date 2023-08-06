import React, { useEffect, useState } from "react";
import { Badge, Container, Table, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "../components/Loading";
import "./OrdersPage.css";

function OrdersPage() {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  useEffect(() => {
    axios
      .post("http://localhost:8000/api/order") // Assuming the API endpoint is /api/orders
      .then(({ data }) => {
        setOrders(data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false); // Set loading to false if there's an error
      });
  }, []);

  const handleOrderSuccess = () => {
    setSuccessMessage("Đơn hàng đã được tạo thành công.");
  };

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return <h1 className="text-center pt-3">No orders yet</h1>;
  }

  return (
    <Container>
      {successMessage && (
        <Alert
          variant="success"
          onClose={() => setSuccessMessage("")}
          dismissible
        >
          {successMessage}
        </Alert>
      )}
      <h1 className="text-center">Your orders</h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Date</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>
                <Badge
                  bg={order.status === "processing" ? "warning" : "success"}
                  text="white"
                >
                  {order.status}
                </Badge>
              </td>
              <td>{order.date}</td>
              <td>${order.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-center">
        <button className="btn btn-success" onClick={handleOrderSuccess}>
          Order Success
        </button>
      </div>
    </Container>
  );
}

export default OrdersPage;
