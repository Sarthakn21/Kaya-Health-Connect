import SideDash from "@/components/SideDash/SideDash";

import Footer from "@/components/LandingPage/footer";
import AppointmentList from "@/components/AppointmentList/AppointmentList";
export default function AppointmentPage() {
  
  return (
    <div>
      <div className="mt-[80px] ml-[80px] px-5 pb-5">
        <AppointmentList />
      </div>
    </div>
  );
}
