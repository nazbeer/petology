import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useDispatch } from "react-redux";

import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import { Table, Button } from "antd";
import moment from "moment";

import { PDFDocument, rgb } from "pdf-lib";
import opentype from "opentype.js";
import * as fontkit from "fontkit";
import { useSelector } from "react-redux";

import * as XLSX from "xlsx";

function Payments() {
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [payments, setPayments] = useState([]);
  const [font, setFonts] = useState("");

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

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
    console.log(user?.isAdmin || user?.isNurse)
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
  return (
    <div>
      <Layout>
        <Table
          columns={columns}
          dataSource={payments}
          responsive={true}
          scroll={{ x: true }}
        />
      </Layout>
    </div>
  );
}

export default Payments;