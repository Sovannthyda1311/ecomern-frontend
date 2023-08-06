import React, { useState, useEffect } from "react";
import { Alert, Col, Container, Form, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewProduct.css";
import Cookies from "js-cookie";

function NewProduct() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]);
  const [isError, setIsError] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [imgToRemove, setImgToRemove] = useState(null);

  const navigate = useNavigate();
  const TOKEN = Cookies.get("jwt");

  useEffect(() => {
    // Function to clear the error and delete message after 5 seconds
    const clearMessages = () => {
      setIsError("");
      setIsDelete(false);
    };

    // If isError or isDelete changes, start the timeout to clear the messages
    if (isError || isDelete) {
      const timeoutId = setTimeout(clearMessages, 1000); // 5000 milliseconds (5 seconds)

      // Cleanup the timeout on component unmount or if isError/isDelete changes again
      return () => clearTimeout(timeoutId);
    }
  }, [isError, isDelete]);

  const handleRemoveImg = (imgObj) => {
    const public_id = imgObj.public_id;
    setImgToRemove(public_id);
    axios
      .delete(`http://localhost:8000/images/${public_id}`)
      .then((res) => {
        setImgToRemove(null);
        setImages((prev) => prev.filter((img) => img.public_id !== public_id));
        setIsDelete(true); // Set isDelete to true to trigger the Alert message for successful deletion
      })
      .catch((e) => console.error(e));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !desc ||
      !price ||
      !category ||
      images.length === 0 ||
      !quantity
    ) {
      setIsError("Please fill out all the fields");
    } else {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/product",
          {
            title,
            Desc: desc,
            image: images[0].url,
            category,
            Price: price,
            Quantity: quantity,
          },
          {
            headers: {
              authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        setIsError(
          res.data === "you create success!"
            ? "Product created with success"
            : "Product created with Error"
        );
        setCategory("");
        setDesc("");
        setPrice("");
        setTitle("");
        setQuantity("");
      } catch (error) {
        console.error(error);
        setIsError(
          "Error occurred while submitting the form. Please try again later."
        );
      }
    }
  };

  const showWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dzvpe0lwi",
        uploadPreset: "gcarl87k",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          setImages((prev) => [
            { url: result.info.url, public_id: result.info.public_id },
            ...prev,
          ]);
        }
      }
    );
    widget.open();
  };

  return (
    <Container>
      <Row>
        <Col md={6} className="new-product__form--container">
          <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <h1 className="mt-4">Create a product</h1>

            {isError === "Product created with success" && (
              <Alert variant="success">{isError}</Alert>
            )}
            {(isError === "Product created with Error" || isDelete) && (
              <Alert variant="danger">
                {isError || "Image deleted successfully"}
              </Alert>
            )}

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
                value={desc}
                required
                onChange={(e) => setDesc(e.target.value)}
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
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Quantity"
                value={quantity}
                required
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option disabled value="">
                  -- Select One --
                </option>
                <option value="Technology">technology</option>
                <option value="phone">phone</option>
                <option value="computer">computer</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Button type="button" onClick={showWidget}>
                Upload Images
              </Button>
              <div className="images-preview-container">
                {images.map((image) => (
                  <div key={image.public_id} className="image-preview">
                    <img src={image.url} alt={`Preview ${image.public_id}`} />
                    {imgToRemove !== image.public_id && (
                      <i
                        className="fa fa-times-circle"
                        onClick={() => handleRemoveImg(image)}
                      ></i>
                    )}
                  </div>
                ))}
              </div>
            </Form.Group>

            <Form.Group>
              <Button type="submit">Create Product</Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md={6} className="new-product__image--container"></Col>
      </Row>
    </Container>
  );
}

export default NewProduct;
