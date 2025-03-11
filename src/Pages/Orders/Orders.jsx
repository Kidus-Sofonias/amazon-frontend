import React, { useContext, useEffect, useState } from "react";
import styles from "./Orders.module.css";
import Layout from "/src/Components/Layout/Layout.jsx";
import { db } from "../../Utility/firebase";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";

function Orders() {
  const [{ user }, dispatch] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot((snapshot) => {
          setOrders(
            snapshot.docs.map((doc)=>({
              id:doc.id,
              data:doc.data(),
            }))
          )
        });
    } else {
      setOrders([])
    }
  }, []);

  return (
    <Layout>
      <section className={styles.container}>
        <div className={styles.orders__container}>
          <h2>Your Orders</h2>
          {
            orders?.length === 0 && <div>You don't have any orders yet.</div>
          }
          <div>
            {
              orders?.map((eachOrder)=>{
                return (
                  <div>
                    <hr />
                    <p>Order ID: {eachOrder?.id}</p>
                    {
                      eachOrder?.data?.basket.map(order=>{
                        return (
                          <ProductCard
                          flex={true}
                          data={order}
                          key={order.id}
                        />
                        );
                      })
                    }
                  </div>
                );
              })
            }
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Orders;
