import React from "react";
import { IoMenuSharp } from "react-icons/io5";
import styles from "./Header.module.css";

function lowerHeader() {
  return (
    <div className={styles.lower__container}>
      <ul>
        <li>
          <IoMenuSharp />
          <p>All</p>
        </li>
        <li>Today's Deals</li>
        <li>Customer Service</li>
        <li>Registry</li>
        <li>Gift Cards</li>
        <li>Sell</li>
      </ul>
    </div>
  );
}

export default lowerHeader;
