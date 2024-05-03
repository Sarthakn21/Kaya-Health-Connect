import SignUp from "@/components/LoginPage/SignUp";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { useEffect } from "react";
export default function RegisterPage() {
  const { currentUser, setcurrentUser } = useContext(GlobalContext);
  useEffect(() => {
    if (!currentUser?.role == "Doctor") {
      navigate("/login");
      setcurrentUser(null);
    }
  }, []);
  return (
    <div>
      <div className="pt-[40px] px-[120px] pb-10">
        <SignUp />
      </div>
    </div>
  );
}
