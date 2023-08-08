import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const AppointmentCharts = () => {
  const [chartData, setChartData] = useState([]);
  const dispatch = useDispatch();
  const getAppChartData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setChartData(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  }
  useEffect(() => {
   
    getAppChartData();
  }, []);

  const options = {
    animationEnabled: true,
    title: {
      text: "",
    },
    subtitles: [
      {
        text: "Appointments",
        verticalAlign: "center",
        fontSize: 24,
        dockInsidePlotArea: true,
      },
    ],
    credit:false,
    data: [
      {
        type: "doughnut",
        showInLegend: true,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###'%'",
        dataPoints: 	 [
					{ name: "Approved", y: 5 },
					{ name: "Pending", y: 31 },
					{ name: "Closed", y: 40 },
	
				],
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default AppointmentCharts;
