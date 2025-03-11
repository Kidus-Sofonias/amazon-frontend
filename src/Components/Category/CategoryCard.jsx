import React from "react";
import styles from "./Category.module.css";
import { Link } from "react-router-dom";

function CategoryCard({ data }) {
  return (
    <div className={styles.category}>
      <Link to={`/category/${data.category}`}>
        <span>
          <h2>{data.category}</h2>
        </span>
        <img src={data.image} alt="" />
        <p>Shop now</p>
      </Link>
    </div>
  );
}

export default CategoryCard;
