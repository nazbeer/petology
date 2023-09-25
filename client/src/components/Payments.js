import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useDispatch } from "react-redux";

import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import { Table, Button, DatePicker } from "antd";
import moment from "moment";

import { PDFDocument, rgb } from "pdf-lib";
import opentype from "opentype.js";
import * as fontkit from "fontkit";
import { useSelector } from "react-redux";

import * as XLSX from "xlsx";

import JsPDF from "jspdf";
import "jspdf-autotable";

function Payments() {
  const { RangePicker } = DatePicker;

  const [watermarkImage, setWatermarkImage] = useState(null);
  const [payments, setPayments] = useState([]);
  const [font, setFonts] = useState("");

  const [filter, setFilter] = useState(true);

  const [filterType, setFilterType] = useState("");
  let [onlyDate, setOnlyDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleFilterType = (event) => {
    console.log(event.target.value);
    setFilterType(event.target.value);
  };

  const getPaymentData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-pay", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response?.data?.data);

        setPayments(response?.data?.data);
        //  setPayments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const getPaymentDatabyuserId = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-pay-by-userId", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response?.data?.data);

        setPayments(response?.data?.data);
        //  setPayments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const createPDF = async (record) => {
    // if (!watermarkImage) {
    //   alert('Please select a watermark image.');
    //   return;
    // }

    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const customFont = await pdfDoc.embedFont(font.toArrayBuffer());
      const page = pdfDoc.addPage();
      page.setFont(customFont);

      const image = await pdfDoc.embedPng(await watermarkImage.arrayBuffer());

      // Calculate the center coordinates
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();
      const imageWidth = 400; // Adjust the image width as needed
      const imageHeight = 400; // Adjust the image height as needed
      const centerX = (pageWidth - imageWidth) / 2;
      const centerY = (pageHeight - imageHeight) / 2;

      // Define watermark position, size, and opacity
      const watermarkOptions = {
        x: centerX,
        y: centerY,
        width: imageWidth,
        height: imageHeight,
        opacity: 0.3, // Adjust the opacity as needed
      };

      page.drawImage(image, watermarkOptions);

      page.drawText(`Invoice for Transaction ID: ${record?.payment?._id}`, {
        x: centerX - 35, // Adjust the X position as needed
        y: pageHeight - 110, // Adjust the Y position as needed
        size: 20,
        color: rgb(0, 0, 0),
      });

      const textFields = [
        {
          label: "Appointment ID",
          value: record?.appointment?.customId,
          fontSize: 14,
        },
        {
          label: "Date",
          value: moment(record?.payment?.createdAt).format("D MMM, YYYY"),
          fontSize: 14,
        },
        {
          label: "Name",
          value: record?.user?.name,
          fontSize: 14,
        },
        {
          label: "Email",
          value: record?.user?.email,
          fontSize: 14,
        },
        {
          label: "Mobile Number",
          value: record?.user?.mobile,
          fontSize: 14,
        },
        {
          label: "Transaction ID",
          value: record?.payment?._id,
          fontSize: 14,
        },

        {
          label: "Amount",
          value: record?.payment?.amount + " AED",
          fontSize: 14,
        },
        {
          label: "Status",
          value: record?.payment?.status,
          fontSize: 14,
        },
      ];

      textFields.forEach((text, index) => {
        const textY = pageHeight - 190 - index * 30; // Adjust Y position for each text
        page.drawText(text.label, {
          x: 50, // Adjust the X position as needed
          y: textY - (text?.margin ? text?.margin : 0),
          size: text.fontSize,
          color: rgb(0.5, 0.5, 0.5),
        });

        page.drawText(text?.value?.toString(), {
          x: 370, // Adjust the X position as needed
          y: textY - (text?.margin ? text?.margin : 0),
          size: text.fontSize,
          color: rgb(0, 0, 0),
          right: 1,
        });
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${record?.payment?._id}.pdf`;
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating watermark PDF:", error);
    }
  };

  useEffect(() => {
    console.log(user?.isAdmin || user?.isNurse);
    if (user?.isAdmin || user?.isNurse) getPaymentData();
    else getPaymentDatabyuserId();
    const loadImage = async () => {
      try {
        const response = await fetch("../logo-petology.png");
        const blob = await response.blob();
        setWatermarkImage(blob);
      } catch (error) {
        console.error("Error loading watermark image:", error);
      }
    };

    loadImage();
    async function customFont() {
      // Load your custom font file
      const fontData = await fetch(
        "../fonts/Outfit/static/Outfit-Regular.ttf"
      ).then((res) => res.arrayBuffer());
      const font = await opentype.parse(fontData);
      setFonts(font);
    }
    customFont();
  }, []);

  const createExcel = (record) => {
    // Sample data in the form of a list of objects
    const data = [
      [
        "Appointment ID",
        "Date",
        "Name",
        "Email",
        "Mobile Number",
        "Transaction ID",
        "Amount",
        "Status",
      ],
      [
        record?.appointment?.customId,
        moment(record?.payment?.createdAt).format("D MMM, YYYY"),
        record?.user?.name,
        record?.user?.email,
        record?.user?.mobile,
        record?.payment?._id,
        record?.payment?.amount + " AED",
        record?.payment?.status,
      ],
    ];
    const heading = `Invoice for Transaction ID: ${record?.payment?._id}`;
    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    // Add a worksheet for heading

    const worksheet = XLSX.utils.aoa_to_sheet([[heading], ...data]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate the Excel file
    XLSX.writeFile(workbook, `${record?.payment?._id}.xlsx`);
  };
  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "customId",
      render: (text, record) => (
        <span className="text-capitalize">{record?.appointment?.customId}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",

      render: (date, record) => (
        <span className="w-100">
          {moment(record?.payment?.createdAt).format("D MMM, YYYY")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",

      render: (text, record) => (
        <span className="text-capitalize">{record?.payment?.status}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",

      render: (text, record) => (
        <span className="text-capitalize">{record?.user?.name}</span>
      ),
    },

    {
      title: "Transaction ID",
      dataIndex: "_id",

      render: (text, record) => <span>{record?.payment?._id}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => <span>{record?.payment?.amount} AED</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",

      render: (text, record) => (
        <div className="d-flex justify-content-evenly">
          <Button
            type="success"
            className="btn btn-success btn-sm"
            onClick={() => createPDF(record)}
          >
            PDF
          </Button>
          <Button
            type="warning"
            className="btn btn-success btn-sm"
            onClick={() => createExcel(record)}
          >
            Excel
          </Button>
        </div>
      ),
    },
  ];

  const handleFilter = () => {
    onlyDate = new Date(onlyDate);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const filtered = payments.filter((item) => {
      console.log(item);
      const itemDate = new Date(item?.payment?.createdAt);
      console.log(
        onlyDate.toDateString(),
        startDateObj.toDateString(),
        endDateObj.toDateString(),
        itemDate.toDateString()
      );
      if (filterType === "Date") {
        return itemDate.toDateString() === onlyDate.toDateString();
      } else {
        // Date range filter
        console.log(
          itemDate.toDateString(),
          startDateObj.toDateString(),
          endDateObj.toDateString()
        );

        return (
          itemDate.toDateString() >= startDateObj.toDateString() &&
          itemDate.toDateString() <= endDateObj.toDateString()
        );
      }
    });

    console.log(filtered);

    setFilteredData(filtered.length > 0 ? filtered : null);

    console.log(filtered.length > 0 ? filtered : null);

    setFilter(false);
  };

  const onChangeDate = (date, dateString) => {
    setOnlyDate(moment(dateString).format("LL"));

    console.log(moment(dateString).format("LL"));
  };

  const onChangeRange = (date, dateString) => {
    setStartDate(moment(dateString[0]).format("LL"));
    setEndDate(moment(dateString[1]).format("LL"));
    console.log(
      moment(dateString[0]).format("LL"),
      moment(dateString[1]).format("LL")
    );
  };

  const createPdfWithTable = async (data) => {
    const doc = new JsPDF();
    doc.setFontSize(30);
    doc.text(80, 20, "Payments");

    doc.setFontSize(20);

    const headers = [
      "Appointment ID",
      "Date",
      "Status",
      "Name",
      "Transaction ID",
      "Amount",
    ];
    const datas = filteredData.map((item) => [
      item?.appointment?.customId,

      moment(item?.payment?.createdAt).format("LL"),
      item?.appointment?.status,
      item?.user?.name,

      item?.payment?._id,
      item?.payment?.amount,
    ]);
    console.log(datas);

    doc.autoTable({
      head: [headers],
      body: datas,
      theme: "striped",
      margin: { top: 30 },
    });

    const pdfBytes = doc.save("payments.pdf");

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.pdf";
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Layout>
        <div className="row">
          <div className="mb-2 col">
            <select
              className="form-control"
              id="break"
              name="break"
              value={filterType}
              onChange={handleFilterType}
            >
              <option defaultValue="">Select Filter...</option>
              <option value="Date">Date</option>
              <option value="Range">Range</option>
              {/* <option value="Weekly">Weekly</option>
              <option value="Montly">Montly</option> */}
            </select>
          </div>
          {filterType === "Range" && (
            <div className="mb-2 col">
              <RangePicker onChange={onChangeRange} style={{ width: "100%" }} />
            </div>
          )}
          {filterType === "Date" && (
            <div className="mb-2 col">
              <DatePicker
                onChange={onChangeDate}
                size="large"
                style={{ width: "100%" }}
              />
            </div>
          )}
          <div className="mt-1 col">
            <button
              type="submit"
              className="btn btn-success btn-sm me-3"
              onClick={handleFilter}
            >
              Filter
            </button>
            <button
              type="submit"
              className="btn btn-success btn-sm"
              onClick={createPdfWithTable}
              disabled={filter}
            >
              Export to PDF
            </button>
          </div>
        </div>
        {filteredData !== null ? (
          filteredData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={filteredData}
              responsive={true}
              scroll={{ x: true }}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={payments}
              responsive={true}
              scroll={{ x: true }}
            />
          )
        ) : (
          <div className="text-center m-5">No result found</div>
        )}
      </Layout>
    </div>
  );
}

export default Payments;
