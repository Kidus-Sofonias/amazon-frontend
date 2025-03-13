import React, { useContext, useState } from "react";
import styles from "./Payment.module.css";
import Layout from "/src/Components/Layout/Layout.jsx";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import CurrencyFormat from "../../Components/Currencyformat/CurrencyFormat";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";

function Payment() {
  // Destructure user and basket from DataContext using useContext hook
  const [{ user, basket }, dispatch] = useContext(DataContext);

  // Calculate the total number of items in the basket
  const totalItem =
    basket?.reduce((amount, item) => item.amount + amount, 0) || 0;

  // Calculate the total price of items in the basket
  const totalPrice = basket.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  );

  // Initialize Stripe and Elements hooks
  const stripe = useStripe();
  const elements = useElements();

  // Initialize useNavigate hook for navigation
  const navigate = useNavigate();

  // State to handle card errors
  const [cardError, setCardError] = useState(null);

  // Function to handle changes in the CardElement and set card errors
  const handleChange = (e) => {
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

  // State to handle processing state
  const [processing, setProcessing] = useState(false);

  // Function to handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setProcessing(true);

      // Make a POST request to create a payment intent
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${totalPrice * 100}`,
      });

      // Get the client secret from the response
      const clientSecret = response.data?.clientSecret;

      // Confirm the card payment using Stripe
      const paymentIntent = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      console.log("Payment Intent:", paymentIntent);

      // Ensure the amount is not undefined
      if (paymentIntent.paymentIntent.amount === undefined) {
        throw new Error("Payment amount is undefined");
      }

      // Save the order details in the database
      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket: basket,
          amount: paymentIntent.paymentIntent.amount,
          created: paymentIntent.paymentIntent.created,
        });

      // Dispatch an action to empty the basket
      dispatch({ type: Type.EMPTY_BASKET });

      setProcessing(false);
      console.log("Navigating to /orders");

      // Navigate to the orders page with a success message
      navigate("/orders", { state: { msg: "You have placed new Order" } });
    } catch (error) {
      console.log(error);
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <div className={styles.payment__header}>Checkout ({totalItem}) items</div>
      <section className={styles.payment}>
        <div className={styles.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email || "No email provided"}</div>
            <div>123 React</div>
            <div>Chicago, IL</div>
          </div>
        </div>
        <hr />

        <div className={styles.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard data={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />
        <div className={styles.flex}>
          <h3>Payment Methods</h3>
          <div className={styles.payment__card__container}>
            <div className={styles.payment__details}>
              <form onSubmit={handlePayment}>
                {cardError && (
                  <small style={{ color: "red" }}>{cardError}</small>
                )}
                <CardElement onChange={handleChange} />
                <div className={styles.payment__price}>
                  <div>
                    <span className={styles.flex}>
                      <p>Total Order |</p>
                      <CurrencyFormat amount={totalPrice} />
                    </span>
                  </div>
                  <button type="submit">
                    {processing ? (
                      <div className={styles.loading}>
                        <ClipLoader size={15} color={"grey"} />
                        <p>Please wait ...</p>
                      </div>
                    ) : (
                      "Pay now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Payment;
