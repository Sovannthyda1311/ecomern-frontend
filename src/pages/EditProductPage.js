import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Form, Row, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./NewProduct.css";
import Cookies from "js-cookie";

function EditProductPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imgToRemove, setImgToRemove] = useState(null);
  const token = Cookies.get("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/product/${id}`)
      .then(({ data }) => {
        const product = data.product;
        setTitle(product.title);
        setDescription(product.Desc);
        setCategory(product.category);
        setImages(product.images);
        setPrice(product.Price);
      })
      .catch((e) => console.log(e));
  }, [id]);

  function handleRemoveImg(imgObj) {
    setImgToRemove(imgObj.public_id);
    axios
      .delete(`/images/${imgObj.public_id}/`)
      .then((res) => {
        setImgToRemove(null);
        setImages((prev) =>
          prev.filter((img) => img.public_id !== imgObj.public_id)
        );
      })
      .catch((e) => console.log(e));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description || !price || !category) {
      return alert("Please fill out all the fields");
    }
    const updatedProduct = {
      title,
      Desc: description,
      Price: price,
      category,
      // images,
    };
    axios
      .patch(`http://localhost:8000/api/product/${id}`, updatedProduct, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        navigate("/admin");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // function showWidget() {
  //   const widget = window.cloudinary.createUploadWidget(
  //     {
  //       cloudName: "your-cloudname",
  //       uploadPreset: "your-preset",
  //     },
  //     (error, result) => {
  //       if (!error && result.event === "success") {
  //         setImages((prev) => [
  //           ...prev,
  //           { url: result.info.url, public_id: result.info.public_id },
  //         ]);
  //       }
  //     }
  //   );
  //   widget.open();
  // }
  return (
    <Container>
      <Row>
        <Col md={6} className="new-product__form--container">
          <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <h1 className="mt-4">Edit product</h1>
            <Form.Group className="mb-3">
              <Form.Label>Product name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Product description"
                style={{ height: "100px" }}
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price($)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Price ($)"
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option disabled value="">
                  -- Select One --
                </option>
                <option value="Technology">Technology</option>
                <option value="phone">phone</option>
                <option value="computer">computer</option>
              </Form.Control>
            </Form.Group>

            {/* <Form.Group className="mb-3">
              <Button type="button" onClick={showWidget}>
                Upload Images
              </Button>
              <div className="images-preview-container">
                {images.map((image) => (
                  <div className="image-preview">
                    <img src={image.url} alt="Product" />
                    {imgToRemove !== image.public_id && (
                      <i
                        className="fa fa-times-circle"
                        onClick={() => handleRemoveImg(image)}
                      ></i>
                    )}
                  </div>
                ))}
              </div>
            </Form.Group> */}

            <Button type="submit">Update Product</Button>
          </Form>
        </Col>
        <Col md={6} className="new-product__image--container"></Col>
      </Row>
    </Container>
  );
}

export default EditProductPage;
