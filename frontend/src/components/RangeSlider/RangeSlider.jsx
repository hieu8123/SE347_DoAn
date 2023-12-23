import { useState } from "react";
import "./RangeSlider.css";
import numeral from "numeral";
import Slider from "react-slider";

function RangeSlider({ onChange }) {
  const [value, setValue] = useState([0, 50000000]);
  const handleChange = (value) => {
    setValue(value);
    onChange(value);
  };
  return (
    <div className="range-slider">
      <span className="range-slider__valueMin">
        {numeral(value[0]).format("0,0")} đ
      </span>
      <Slider
        className="slide"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        defaultValue={[10, 50000000]}
        min={0}
        max={50000000}
        minDistance={100000}
        step={100000}
        onChange={(value, index) => handleChange(value)}
      />
      <span className="range-slider__valueMax">
        {numeral(value[1]).format("0,0")} đ
      </span>
    </div>
  );
}

export default RangeSlider;
