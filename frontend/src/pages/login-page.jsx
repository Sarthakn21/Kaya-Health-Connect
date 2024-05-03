import SignIn from "@/components/LoginPage/SignIn";
import Login from "@/components/LoginPage/login";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { useEffect } from "react";
export default function LoginPage(props) {
  const { setCurrentUser } = useContext(GlobalContext);
  useEffect(() => {
    if (props.doneed == true) {
      localStorage.clear();
      setCurrentUser(null);
    }
  }, []);
  return (
    <div>
      <div className="pt-[40px] px-[120px] pb-10">
        <SignIn />
      </div>
    </div>
  );
}
