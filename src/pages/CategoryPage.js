import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ProductPreview from "../components/ProductPreview";
import "./CategoryPage.css";
import Pagination from "../components/Pagination";

function CategoryPage() {
  const { category } = useParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true); // Set loading to true before making the request
    axios
      .get(
        category === "all"
          ? `http://localhost:8000/api/product`
          : `http://localhost:8000/api/product/category/${category}`
      )
      .then(({ data }) => {
        setProducts(data);
      })
      .catch((e) => {
        console.log(e.message);
      })
      .finally(() => {
        setLoading(false); // Set loading to false regardless of success or error
      });
  }, [category]);
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="category-page-container">
      <div
        className={`pt-3 ${category}-banner-container category-banner-container`}
      >
        <h1 className="text-center">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
      </div>
      <div className="filters-container d-flex justify-content-center pt-4 pb-4">
        <input
          type="search"
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <Loading />
      ) : products.length === 0 ? (
        <h1>No products to show</h1>
      ) : (
        <Container>
          {Array.from(
            { length: Math.ceil(filteredProducts.length / 3) },
            (_, index) => {
              const startIndex = index * 3;
              const rowProducts = filteredProducts.slice(
                startIndex,
                startIndex + 3
              );

              return (
                <Row key={index}>
                  {rowProducts.map((item) => (
                    <Col md={4} key={item.id}>
                      <ProductPreview
                        id={item.id}
                        category={item.category}
                        image={item.image}
                        title={item.title}
                      />
                    </Col>
                  ))}
                </Row>
              );
            }
          )}
        </Container>
      )}
    </div>
  );
}

export default CategoryPage;
