import axios from "../axios";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import {
  Container,
  Row,
  Col,
  Badge,
  ButtonGroup,
  Form,
  Button,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import "./ProductPage.css";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductPage() {
  const { id } = useParams();
  const user = Cookies.get("jwt");
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState("");

  const handleDragStart = (e) => e.preventDefault();
  console.log(stock);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/product/${id}`)
      .then(({ data }) => {
        if (data.message === "Product is out of stock") {
          setProduct(data.products);
          setStock(data.message);
        } else {
          setProduct(data);
          setStock("");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch product:", error);
      });
  }, [id]);

  if (!product) {
    return <Loading />;
  }

  const handleAddCart = async () => {
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        console.error("User not logged in. Token not found.");
        return;
      }

      await axios.post(
        `http://localhost:8000/api/cart/${id}`,
        { Quantity: quantity },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`${product.title} has been added to the cart!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "light",
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error(
        `Failed to add the product to the cart.${error.response.data.error}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          newestOnTop: false,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
          theme: "light",
        }
      );
    }
  };

  return (
    <Container className="pt-4" style={{ position: "relative" }}>
      <Row>
        <Col lg={6}>
          <AliceCarousel
            mouseTracking
            items={[
              <img
                className="product__carousel--image"
                src={product.image}
                onDragStart={handleDragStart}
                alt="Product"
              />,
            ]}
            controlsStrategy="alternate"
          />
        </Col>

        <Col lg={6} className="pt-4">
          <h1>{product.title}</h1>
          <p>
            <Badge bg="primary">{product.category}</Badge>
          </p>
          <p className="product__price">${product.Price}</p>
          <p style={{ textAlign: "justify" }} className="py-3">
            <strong>Description:</strong> {product.Desc}
          </p>
          {user && !user.isAdmin && (
            <ButtonGroup style={{ width: "90%" }}>
              <Form.Select
                size="lg"
                style={{ width: "40%", borderRadius: "0" }}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Select>
              <Button onClick={handleAddCart} disabled={stock ? true : false}>
                {stock ? "Product is out of stock" : "Add to Cart"}
              </Button>
            </ButtonGroup>
          )}
        </Col>
      </Row>

      <ToastContainer
        position="top-right"
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
    </Container>
  );
}

export default ProductPage;
