import React, { useState, useEffect, useMemo } from "react";
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

  const [payments, setPayments] = useState([]);
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

  function sumValuesByMonth(data) {
    const monthlySum = {};

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    data.forEach((item) => {
      const date = new Date(item?.payment?.createdAt);
      // const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = monthNames[date.getMonth()];

      if (!monthlySum[monthName]) {
        monthlySum[monthName] = 0;
      }

      monthlySum[monthName] += item?.payment?.amount;
    });

    let result = Object.keys(monthlySum).map((monthName) => ({
      x: monthName,
      y: monthlySum[monthName],
    }));

    const getMonthNumber = (monthName) => {
      return new Date(`${monthName} 1, 2023`).getMonth();
    };

    return result.sort((a, b) => getMonthNumber(a.x) - getMonthNumber(b.x));

  }

  const getPayments = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-pay", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        const data = response?.data?.data;
        console.log(response?.data?.data);
        console.log(sumValuesByMonth(data));
        setPayments(sumValuesByMonth(data));
        const monthlySum = {};

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        data.forEach((item) => {
          const date = new Date(item?.payment?.createdAt);
          // const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          console.log(`   ${date.getFullYear()}`);
          const monthName = monthNames[date.getMonth()];

          if (!monthlySum[monthName]) {
            monthlySum[monthName] = 0;
          }

          monthlySum[monthName] += item?.payment?.amount;
        });

        console.log(monthlySum);

        const result = Object.keys(monthlySum).map((monthName) => ({
          x: monthName,
          y: monthlySum[monthName],
        }));

        setPayments(result);
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
  }, [pendingCount]);
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
  }, [closedCount]);
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
  }, [approvedCount]);
  useEffect(() => {
    getAppChartData();
    getPayments();
    console.log(payments);
  }, []);

  const optionsBar = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "",
    },
    axisX: {
      interval: 1,
      title: 'Months',
      labels: payments.map((item) => item.x), // Month names
    },
    axisY: {
      title: 'Amount'
    },

    data: [
      {
        type: "column",
        dataPoints: payments.map((item) => ({ label: item.x, y: item.y })), // Sum of values
      },
    ],
  };

  console.log(optionsBar);

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
          { name: "Approved", y: (approvedCount / total) * 100 },
          { name: "Pending", y: (pendingCount / total) * 100 },
          { name: "Closed", y: (closedCount / total) * 100 },
        ],
      },
    ],
  };

  return (
    <div className="row">
      <div className="col">
        <CanvasJSChart options={options} />
      </div>
      <div className="col">
        <CanvasJSChart options={optionsBar} />{" "}
      </div>
    </div>
  );
};

export default AppointmentCharts;
