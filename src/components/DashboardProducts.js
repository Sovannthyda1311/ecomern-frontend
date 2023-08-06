import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./DashboardProducts.css";
import axios from "axios";
import Cookies from "js-cookie";

function DashboardProducts() {
  const [products, setProducts] = useState([]);
  const token = Cookies.get("jwt");
  const getProduct = async () => {
    const res = await axios.get("http://localhost:8000/api/product");
    setProducts(res.data);
  };
  useEffect(() => {
    getProduct();
  }, []);

  const handleDelete = async (ProductId) => {
    console.log(ProductId);
    try {
      await axios.delete(`http://localhost:8000/api/product/${ProductId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      getProduct();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Images</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Product Price</th>
          {/* <th>
            <Link to={`/new-product`} className="btn btn-warning">
              product
            </Link>
          </th> */}
        </tr>
      </thead>
      <tbody>
        {products.map((item) => (
          <tr key={item.id}>
            <td>
              <img
                src={item.image}
                className="dashboard-product-preview"
                alt={item.title}
              />
            </td>
            <td>{item.id}</td>
            <td>{item.title}</td>
            <td>${item.Price}</td>
            <td>
              <Link to={`/product/${item.id}/edit`} className="btn btn-warning">
                Edit
              </Link>
            </td>
            <td>
              <button
                onClick={() => handleDelete(item.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default DashboardProducts;
