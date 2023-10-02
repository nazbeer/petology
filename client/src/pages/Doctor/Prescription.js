import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { DatePicker } from "antd";
import moment from "moment";
import { Form, Input, Modal, Button } from "antd";

import { PDFDocument, rgb } from "pdf-lib";
import { pdfjs } from "react-pdf";

import JsPDF from "jspdf";
import "jspdf-autotable";

import opentype from "opentype.js";
import * as fontkit from "fontkit";

import { toast } from "react-hot-toast";

const Prescription = () => {
  const { RangePicker } = DatePicker;
  const [prescriptions, setPrescriptions] = useState([]);

  const [filter, setFilter] = useState(true);

  const [filterType, setFilterType] = useState("");
  let [onlyDate, setOnlyDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [modalShowVisible, setModalShowVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);

  const [font, setFonts] = useState("");
  const [watermarkImage, setWatermarkImage] = useState(null);

  const [form] = Form.useForm();

  const handleFilterType = (event) => {
    console.log(event.target.value);
    setFilterType(event.target.value);
  };

  useEffect(() => {
    getPrescriptions();
  }, []);
  const getPrescriptions = async () => {
    try {
      const response = await axios.get("/api/doctor/get-prescription", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response?.data); // Assuming the prescriptions are in response.data

      if (response.data) {
        console.log(response?.data?.data);
        setPrescriptions(response?.data?.data); // Update the state with prescriptions data
      } else {
        throw new Error("Error while fetching data");
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  };

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
    loadImage();

    async function customFont() {
      // Load your custom font file
      const fontprescription = await fetch(
        "../fonts/Outfit/static/Outfit-Regular.ttf"
      ).then((res) => res.arrayBuffer());
      const font = await opentype.parse(fontprescription);
      setFonts(font);
    }
    customFont();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      id: selectedPrescription?._id,
      appointmentId: selectedPrescription?.appointment?.customId,
      userName: selectedPrescription?.user?.name,
      pet: selectedPrescription?.appointment?.pet,
      date: moment(selectedPrescription?.appointment?.date).format("LL"),
      petName: selectedPrescription?.appointment?.petName,
      doctorName:
        selectedPrescription?.doctor?.firstName +
        " " +
        selectedPrescription?.doctor?.lastName,
      prescription: selectedPrescription?.prescription,
      description: selectedPrescription?.description,
    });
  }, [selectedPrescription, form]);

  const handleFilter = () => {
    onlyDate = new Date(onlyDate);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const filtered = prescriptions.filter((item) => {
      console.log(item);
      const itemDate = new Date(item?.prescription?.ndate);
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
    doc.text(80, 20, "Prescriptions");

    doc.setFontSize(20);

    const headers = [
      "Appointment Id",
      "Prescription",
      "Description",
      "Next Appointment",
    ];
    const datas =
      filteredData &&
      filteredData.map((item) => [
        item?.appointment?.customId,
        item?.prescription?.prescription,
        item?.prescription?.description,
        moment(item?.prescription?.ndate).format("LL"),
      ]);
    console.log(datas);

    doc.autoTable({
      head: [headers],
      body: datas,
      theme: "striped",
      margin: { top: 30 },
    });

    const pdfBytes = doc.save("prescription.pdf");

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "prescription.pdf";
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  const showShowPrescriptionModal = (prescription) => {
    setSelectedPrescription(prescription);
    setModalShowVisible(true);
  };

  const hideShowPrescriptionModal = () => {
    setSelectedPrescription(null);
    setModalShowVisible(false);
  };

  const showEditPrescriptionModal = (prescription) => {
    setPrescriptionId(prescription._id);
    setSelectedPrescription(prescription);
    setModalEditVisible(true);
  };

  const hideEditPrescriptionModal = () => {
    setPrescriptionId(null);

    setSelectedPrescription(null);
    setModalEditVisible(false);
  };

  const createPDF = async () => {
    try {
      const textFields = [
        {
          label: "Appointment ID",
          value: selectedPrescription?.appointment?.customId,
          fontSize: 14,
        },
        {
          label: "User Name",
          value: selectedPrescription?.user?.name,
          fontSize: 14,
        },
        {
          label: "Doctor",
          value:
            selectedPrescription?.doctor?.firstName +
            " " +
            selectedPrescription?.doctor?.lastName,
          fontSize: 14,
        },
        {
          label: "Pet",
          value: selectedPrescription?.appointment?.pet,
          fontSize: 14,
        },
        {
          label: "Pet Name",
          value: selectedPrescription?.appointment?.petName,
          fontSize: 14,
        },

        {
          label: "Date",
          value: moment(selectedPrescription?.appointment?.date).format("LL"),
          fontSize: 14,
        },
        {
          label: "Prescription",
          value: selectedPrescription?.prescription,
          fontSize: 14,
        },

        {
          label: "Description",
          value: selectedPrescription?.description,
          fontSize: 14,
        },
      ];
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
        opacity: 0.5, // Adjust the opacity as needed
      };

      page.drawImage(image, watermarkOptions);

      page.drawText("Prescription Details", {
        x: centerX + 70, // Adjust the X position as needed
        y: pageHeight - 100, // Adjust the Y position as needed
        size: 30,
        color: rgb(0, 0.5, 0),
      });

      textFields.forEach((text, index) => {
        const textY = pageHeight - 250 - index * 30; // Adjust Y position for each text
        page.drawText(text?.label, {
          x: 50, // Adjust the X position as needed
          y: textY - (text?.margin ? text?.margin : 0),
          size: text.fontSize,
          color: rgb(0.5, 0.5, 0.5),
        });

        page.drawText(text?.value ? text?.value?.toString() : "", {
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
      a.download = `${selectedPrescription?.appointment?.customId}.pdf`;
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating watermark PDF:", error);
    }
  };
  const handleSubmit = async (values) => {
    console.log(prescriptionId);
    try {
      const response = await axios.post(
        "/api/doctor//edit-prescription",
        {
          prescriptionId: prescriptionId,
          prescription: values?.prescription,
          description: values?.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response", response);
      if (response.data.success) {
        toast.success("Prescription added successfully");
        //form.resetFields();
        // onClose();
      }
    } catch (error) {
      toast.error("Error adding prescription");
    }
  };

  return (
    <Layout>
      <div>
        <h3 className="text-center">All Prescriptions</h3>

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
        <br />
        <div className="card">
          <div className="card-body">
            <div className="table-responsive-sm">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Appointment Id</th>
                    <th>Prescription</th>
                    <th>Description</th>
                    <th>Next Appointment</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                {filteredData !== null ? (
                  filteredData.length > 0 ? (
                    <tbody>
                      {filteredData?.map((presc) => (
                        <tr key={presc?.prescription?._id}>
                          <td>{presc?.appointment?.customId}</td>
                          <td>{presc?.prescription?.prescription}</td>
                          <td>{presc?.prescription?.description}</td>

                          <td>
                            {moment(presc?.prescription?.ndate).format("LL")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      {prescriptions?.map((presc) => (
                        <tr key={presc?.prescription?._id}>
                          <td>{presc?.appointment?.customId}</td>
                          <td>{presc?.prescription}</td>
                          <td>{presc?.description}</td>
                          <td>{moment(presc?.ndate).format("LL")}</td>
                          <td>
                            <div className="">
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => showShowPrescriptionModal(presc)}
                              >
                                View
                              </button>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => showEditPrescriptionModal(presc)}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )
                ) : (
                  <div className="m-5">No result found</div>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="View Prescription"
        visible={modalShowVisible}
        onCancel={hideShowPrescriptionModal}
        footer={null}
        width={700}
      >
        {selectedPrescription && (
          <div className="col-md-12 ">
            <Form form={form} layout="vertical" width={800}>
              <div className="row">
                <div className="col">
                  <Form.Item label="Appointment ID" name="appointmentId">
                    <Input disabled />
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item label="User" name="userName">
                    <Input disabled />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <Form.Item label="Doctor" name="doctorName">
                    <Input disabled />
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item label="Pet" name="pet">
                    <Input value="Dog" disabled />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <Form.Item label="Pet Name" name="petName">
                    <Input disabled />
                  </Form.Item>
                </div>

                <div className="col">
                  <Form.Item label="Date" name="date">
                    <Input disabled />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <Form.Item label="Prescription" name="prescription">
                    <Input.TextArea disabled />
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item label="Description" name="description">
                    <Input.TextArea disabled />
                  </Form.Item>
                </div>
              </div>
              <Form.Item>
                <div className="d-flex row">
                  <div className="col-9"></div>
                  <div className="col-1 ">
                    <button
                      type="button"
                      className="btn btn-success btn-sm cusrsor-pointer"
                      onClick={createPDF}
                      style={{ width: 130 }}
                    >
                      <i className="ri-download-line"></i>
                      Export to PDF
                    </button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      <Modal
        title="Edit Prescription"
        visible={modalEditVisible}
        onCancel={hideEditPrescriptionModal}
        footer={null}
        width={700}
      >
        {selectedPrescription && (
          <div className="col-md-12 ">
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              width={800}
            >
              <div className="row">
                <div className="col">
                  <Form.Item
                    label="Prescription"
                    name="prescription"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </div>
              </div>
              <Form.Item>
                <Button className="btn btn-success btn-sm" htmlType="submit">
                  Edit Prescription
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Prescription;
