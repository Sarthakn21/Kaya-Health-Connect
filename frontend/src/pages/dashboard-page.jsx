import Dashboard from "@/components/Dashboard/Dashboard";
import Footer from "@/components/LandingPage/footer";
import SideDash from "@/components/SideDash/SideDash";
import { GlobalContext } from "@/context/GlobalContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { currentUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!currentUser) {

  //     navigate("/login");
  //   }
  // }, []);
  return (
    <div>
      <div className="pt-[40px]">
        <Dashboard />
      </div>
    </div>
  );
}
