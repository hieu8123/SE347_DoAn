import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import "./Hero.css";
import logo from "../../../Assests/Image/Hero.png";
import slide1 from "../../../Assests/Image/slide1.jpg";
import slide2 from "../../../Assests/Image/slide2.jpg";
import SlideComponent from "../../SlideComponent/SlideComponent";

console.log(logo);

const Hero = () => {
  return (
    <div>
      <SlideComponent arrImage={[slide1, slide2, slide1]}></SlideComponent>
    </div>
  );
};

export default Hero;