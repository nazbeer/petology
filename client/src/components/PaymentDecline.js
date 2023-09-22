import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { useLocation } from "react-router-dom";

import cross from "../images/cross.png";
import logo from "../images/logo-petology.png";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Page, pdfjs } from "react-pdf";
import opentype from "opentype.js";
import * as fontkit from "fontkit";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PaymentDecline() {
  const { state } = useLocation();
  const [font, setFonts] = useState("");
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [crossImage, setCrossImage] = useState(null);

  const [textFields, setTextFields] = useState([
    { label: "Payment Type", value: "Visa/Mastercard", fontSize: 14 },
    { label: "Mobile", value: state?.service?.mobile, fontSize: 14 },
    {
      label: "Email",
      value: state?.service?.email,
      fontSize: 14,
    },
    {
      label: "Appointment ID",
      value: state?.appointments?.savedAppointment?._id,
      fontSize: 14,
    },
    {
      label: "Amount Paid",
      value: state?.appointments?.doctor?.feePerCunsultation || 80 + " AED",
      fontSize: 19,
      fontStyle: "bold",
      margin: 15,
    },
    {
      label: "Transaction ID",
      value: "249782984529865",
      fontSize: 14,
      margin: 20,
    },
  ]);
  //   const canvasRef = useRef(null);
  console.log(state);
  const img = new Image();
  img.src = logo;
  console.log(img.height);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch("../logo-petology.png");
        const blob = await response.blob();
        setWatermarkImage(blob);
      } catch (error) {
        console.error("Error loading watermark image:", error);
      }
    };
    const loadImage1 = async () => {
      try {
        const response = await fetch("../cross.png");
        const blob = await response.blob();
        setCrossImage(blob);
      } catch (error) {
        console.error("Error loading cross image:", error);
      }
    };
    loadImage();
    loadImage1();

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

  const createPDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const customFont = await pdfDoc.embedFont(font.toArrayBuffer());
      const page = pdfDoc.addPage();
      page.setFont(customFont);

      const image = await pdfDoc.embedPng(await watermarkImage.arrayBuffer());
      const image1 = await pdfDoc.embedPng(await crossImage.arrayBuffer());

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

      page.drawText("Payment Decline", {
        x: centerX + 90, // Adjust the X position as needed
        y: pageHeight - 100, // Adjust the Y position as needed
        size: 30,
        color: rgb(1, 0, 0),
      });

      const successOptions = {
        x: centerX + 160,
        y: pageHeight - 180,
        width: 60,
        height: 60,
        opacity: 1, // Adjust the opacity as needed
      };

      page.drawImage(image1, successOptions);

      textFields.forEach((text, index) => {
        const textY = pageHeight - 250 - index * 30; // Adjust Y position for each text
        page.drawText(text.label, {
          x: 50, // Adjust the X position as needed
          y: textY - (text?.margin ? text?.margin : 0),
          size: text.fontSize,
          color: rgb(0.5, 0.5, 0.5),
        });

        page.drawText(text?.value ? text?.value : "", {
          x: 400, // Adjust the X position as needed
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
      a.download = `${state?.appointments?.savedAppointment?._id}.pdf`;
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating watermark PDF:", error);
    }
  };
  return (
    <div>
      <Layout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="card" style={{ padding: 50 }}>
            <p className="text-danger text-center" style={{ fontSize: 40 }}>
              Payment Decline!
            </p>
            <div className="d-flex justify-content-center align-items-center">
              <img
                src={cross}
                style={{ width: "60px", marginBottom: 50, marginTop: 20 }}
                alt="cross-img"
              />
            </div>
            <div className="row">
              <div className="col" style={{ color: "grey" }}>
                <p
                  className="text-start mb-2 text-black-50"
                  style={{ color: "grey !important" }}
                >
                  Payment Type
                </p>
              </div>
              <div className="col">
                <p className="text-end mb-2">Visa/Mastercard</p>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <p className="text-start mb-2 text-black-50">Mobile</p>
              </div>
              <div className="col">
                <p className="text-end mb-2">{state?.service?.mobile}</p>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <p className="text-start mb-2 text-black-50">Email</p>
              </div>
              <div className="col">
                <p className="text-end mb-2">{state?.service?.email}</p>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <p className="text-start mb-4 text-black-50">Appointment ID</p>
              </div>
              <div className="col">
                <p className="text-end mb-4">
                  {state?.appointments?.savedAppointment?._id}
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <p className="text-start mb-4 fw-bold">Amount Paid</p>
              </div>
              <div className="col">
                <p className="text-end mb-4 fw-bold">
                  {state?.appointments?.doctor?.feePerCunsultation || 80} AED
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <p className="text-start text-black-50">Transaction ID</p>
              </div>
              <div className="col">
                <p className="text-end">249782984529865</p>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center  mt-4">
              <div className="row ">
                <div className="col">
                  <button onClick={createPDF} className="btn btn-success">
                    Print
                  </button>
                </div>

                <div className="col">
                  <button className="btn btn-success">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default PaymentDecline;
