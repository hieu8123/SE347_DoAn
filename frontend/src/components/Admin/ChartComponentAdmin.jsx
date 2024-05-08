import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";
import "chartjs-plugin-datalabels";

function ChartComponentAdmin({ arrData, name }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!arrData) {
      return;
    }

    const groupedDay = arrData.reduce((result, order) => {
      const day = order.day;
      const totalData = order.total;
      result[day] = (result[day] || 0) + totalData;
      return result;
    }, {});
    const sumData = Object.keys(groupedDay).map((day) => ({
      day: day,
      totalData: groupedDay[day],
    }));

    const ctx = document.getElementById("acquisitions");

    if (chartRef.current !== null) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sumData.map((row) => row.day),
        datasets: [
          {
            label: name,
            data: sumData.map((row) => row.totalData),
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            display: true,
            color: "white",
            font: {
              weight: "bold",
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current !== null) {
        chartRef.current.destroy();
      }
    };
  }, [arrData, name]);

  return (
    <>
      <h1>Biểu đồ thống kê {name}</h1>
      <div style={{ width: "800px" }}>
        <canvas id="acquisitions"></canvas>
      </div>
    </>
  );
}

export default ChartComponentAdmin;
