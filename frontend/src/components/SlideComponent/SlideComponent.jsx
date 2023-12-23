import Slider from "react-slick";
import "./Slide.css";
function SlideComponent({ arrImage }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: null,
    nextArrow: null,
  };
  return (
    <Slider {...settings}>
      {arrImage.map((image, index) => {
        return <img src={image} alt="slider" style={{ width: "100%" }} key={index}></img>;
      })}
    </Slider>
  );
}

export default SlideComponent;
