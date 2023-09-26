import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const AppointmentCharts = () => {
  const [chartData, setChartData] = useState([]);
  const [pendingCount, setPendingCount] = useState([]);
  const [closedCount, setClosedCount] = useState([]);
  const [approvedCount, setApprovedCount] = useState([]);
  const [total, setTotal] = useState(0);
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
  };
  useEffect(() => {
    axios
      .get("/api/admin/pending-appointment-count", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setPendingCount(response.data.data))
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    axios
      .get("/api/admin/closed-appointment-count", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setClosedCount(response.data.data), {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    axios
      .get("/api/admin/approved-appointment-count", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setApprovedCount(response.data.data), {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .catch((error) => console.error(error));

    setTotal(approvedCount + closedCount + pendingCount);
    // setPendingCount((approvedCount/total) * 100)
  }, []);
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
    credit: false,
    data: [
      {
        type: "doughnut",
        showInLegend: true,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#.##'%'",
        dataPoints: [
          { name: "Approved", y: (approvedCount/total) * 100  },
          { name: "Pending", y: (pendingCount/total) * 100  },
          { name: "Closed", y: (closedCount/total) * 100  },
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
