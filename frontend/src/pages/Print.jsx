import PrescriptionPrintingPage from "@/components/PrescriptionForm/PrescriptionPrintingPage";
import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { useNavigate } from "react-router-dom";

const Print = () => {
  return (
    <div className="pt-[40px] px-[120px] pb-10">
      <PrescriptionPrintingPage />
    </div>
  );
};

export default Print;
