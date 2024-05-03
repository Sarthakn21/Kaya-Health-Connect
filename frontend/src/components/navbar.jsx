import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="w-full flex flex-row justify-between px-[120px] h-[70px] items-center border-b-2 border-gray-200 ">
            <Link to="/">
                <div className="font-semibold text-xl gap-x-2 flex flex-row items-center">
                    <img src="/logo.png" alt="logo" className="h-[40px] w-[80px]" />
                    KayaHealth Connect
                </div>
            </Link>
            <div className="flex flex-row gap-x-[35px]">
                <Link to="/login">
                    <Button size="lg">Login</Button>
                </Link>
            </div>
        </nav>
    );
};
export default Navbar;
