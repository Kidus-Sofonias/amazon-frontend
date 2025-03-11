import React from 'react'
import CarouselEffect from "/src/Components/Carousel/CarouselEffect.jsx";
import Category from "/src/Components/Category/Category.jsx";
import Product from "/src/Components/Product/Product.jsx";
import Layout from "/src/Components/Layout/Layout.jsx";

function Landing() {
  return (
      <Layout>
        <CarouselEffect />
        <Category />
        <Product />
      </Layout>
  );
}

export default Landing