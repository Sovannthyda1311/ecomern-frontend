import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";

function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("jwt");
  console.log(orders);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/order", {
          headers: { authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handlechange = async (orderid, status) => {
    try {
      if (status === "Cancelled") {
        const confirmDelete = window.confirm(
          "Are you sure you want to cancel this order?"
        );
        if (!confirmDelete) return; // If the user cancels the delete action, do nothing.
      }

      await axios.patch(
        `http://localhost:8000/api/order/${orderid}`,
        {
          status,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      // If the update is successful, update the state to reflect the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderid ? { ...order, status } : order
        )
      );

      if (status === "Cancelled") {
        await axios.delete(`http://localhost:8000/api/order/${orderid}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderid)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="table-container">
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Items</th>
            <th>Order Total</th>
            <th>Address</th>
            <th>PhoneNumber</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.User.Username}</td>
              <td>{order.Products[0]?.title}</td>
              <td>
                $
                {order.Products[0]?.Price *
                  order.Products[0]?.OrderDetail.Quantity}
              </td>
              <td>{order.Address}</td>
              <td>{order.Phonenumber}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handlechange(order.id, e.target.value)}
                >
                  {["Pending", "Approved", "Delivered", "Cancelled"].map(
                    (status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    )
                  )}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default OrdersAdminPage;
