import React, { useState } from "react";
import { Button } from "antd";
import PrescriptionForm from "../Doctor/PrescriptionForm";
import Layout from "../../components/Layout";
const App = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <Layout>
      <div>
        <h1>Prescription Form </h1>
        <Button
          className="btn btn-success btn-sm"
          type="primary"
          onClick={showModal}
        >
          Add Prescription
        </Button>
        <PrescriptionForm onCancel={closeModal} />
      </div>
    </Layout>
  );
};

export default App;
