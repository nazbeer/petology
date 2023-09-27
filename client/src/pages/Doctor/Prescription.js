import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { DatePicker } from "antd";
import moment from "moment";

import JsPDF from "jspdf";
import "jspdf-autotable";

const Prescription = () => {
  const { RangePicker } = DatePicker;
  const [prescriptions, setPrescriptions] = useState([]);

  const [filter, setFilter] = useState(true);

  const [filterType, setFilterType] = useState("");
  let [onlyDate, setOnlyDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

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
    const datas = filteredData.map((item) => [
      item?.appointment?.customId,
      item?.prescription?.prescription,
      item?.prescription?.description,
      moment(item?.prescription?.ndate).format("LL")
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
                          <td>{presc?.prescription?.prescription}</td>
                          <td>{presc?.prescription?.description}</td>
                          <td>
                            {moment(presc?.prescription?.ndate).format("LL")}
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
    </Layout>
  );
};

export default Prescription;
