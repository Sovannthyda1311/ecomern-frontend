import React from "react";
import { Badge, Card } from "react-bootstrap";
import LinkContainer from "react-router-bootstrap/LinkContainer";

function SimilarProduct({ id, title, category, image }) {
  return (
    <LinkContainer
      to={`/product/${id}`}
      style={{ cursor: "pointer", width: "13rem", margin: "10px" }}
    >
      <Card style={{ width: "20rem", margin: "10px" }}>
        <Card.Img
          variant="top"
          className="product-preview-img"
          src={image}
          style={{ height: "150px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Badge bg="warning" text="dark">
            {category}
          </Badge>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
}

export default SimilarProduct;
