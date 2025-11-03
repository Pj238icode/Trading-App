import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketChart } from "@/Redux/Coin/Action";

const timeSeries = [
  { label: "1 Day", value: 1 },
  { label: "1 Week", value: 7 },
  { label: "1 Month", value: 30 },
  { label: "3 Months", value: 90 },
  { label: "6 Months", value: 180 },
  { label: "1 Year", value: 365 },
];

const StockChart = ({ coinId }) => {
  const dispatch = useDispatch();
  const { coin } = useSelector((store) => store);
  const [activeType, setActiveType] = useState(timeSeries[0]);

  useEffect(() => {
    if (coinId) {
      dispatch(
        fetchMarketChart({
          coinId,
          days: activeType.value,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [coinId, activeType.value, dispatch]);

  const series = [
    {
      name: "Price",
      data: coin.marketChart.data || [],
    },
  ];

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#3B82F6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: { type: "datetime", labels: { show: true } },
    yaxis: { labels: { show: true } },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
    tooltip: { theme: "light" },
  };

  if (coin.marketChart.loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex flex-wrap gap-2 mb-6">
        {timeSeries.map((item) => (
          <Button
            key={item.label}
            onClick={() => setActiveType(item)}
            variant={activeType.label === item.label ? "default" : "outline"}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <ReactApexChart options={options} series={series} type="area" height={400} />
    </div>
  );
};

export default StockChart;
