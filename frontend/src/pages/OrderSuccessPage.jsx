import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "lottie-react";
import animationData from "../Assests/animations/107043-success.json";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../server";




const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(true);
useEffect(()=>{
  const isSuccess = async ()=>{
    let paymentMethod = localStorage.getItem("paymentMethod");
    if(paymentMethod == "Cash On Delivery"){
      setIsSuccess(true);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let data = await axios
      .get(`${server}/payment/vnpay-return`, null,{
        params: searchParams
      })
    setIsSuccess(data.status || false);
    let order = await JSON.parse(localStorage.getItem('bill'))
    order.paymentInfo = {
      type: "VNPay",
      status: "Success"
    };

    console.log(order);

    if(data.status){
    await axios
      .post(`${server}/order/create-order`, order, config)
      .then(() => {
        localStorage.setItem("paymentMethod", "Cash On Delivery");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
    }
  }

  isSuccess();
}, [])
  return (
    <div>
      <Header />
      <Messages isSuccess={isSuccess} />
      <Footer />
    </div>
  );
};

const Messages = ( isSuccess) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
 <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
  <Lottie options={defaultOptions} />
  {isSuccess ? (
    <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
      Đặt hàng thành công 😍
    </h5>
  ) : (
    <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
      Đặt hàng không thành công 😞
    </h5>
  )}
  <br />
  <br />
</div>

  );
};

export default OrderSuccessPage;
