import { logout } from "@/Redux/Auth/Action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ExitIcon,
  BookmarkIcon,
  PersonIcon,
  DashboardIcon,
  HomeIcon,
  ActivityLogIcon,
} from "@radix-ui/react-icons";
import { CreditCardIcon, LandmarkIcon, WalletIcon } from "lucide-react";

const menu = [
  { name: "Home", path: "/", icon: <HomeIcon className="h-5 w-5" /> },
  { name: "Portfolio", path: "/portfolio", icon: <DashboardIcon className="h-5 w-5" /> },
  { name: "Watchlist", path: "/watchlist", icon: <BookmarkIcon className="h-5 w-5" /> },
  { name: "Activity", path: "/activity", icon: <ActivityLogIcon className="h-5 w-5" /> },
  { name: "Wallet", path: "/wallet", icon: <WalletIcon className="h-5 w-5" /> },
  { name: "Payment Details", path: "/payment-details", icon: <LandmarkIcon className="h-5 w-5" /> },
  { name: "Withdrawal", path: "/withdrawal", icon: <CreditCardIcon className="h-5 w-5" /> },
  { name: "Profile", path: "/profile", icon: <PersonIcon className="h-5 w-5" /> },
  { name: "Logout", path: "/", icon: <ExitIcon className="h-5 w-5" /> },
];

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuClick = (item) => {
    if (item.name === "Logout") {
      dispatch(logout());
      navigate(item.path);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen p-6 w-full sm:w-64 border-r border-gray-200 ">
      <h2 className="text-xl font-semibold mb-8 text-gray-900 text-center">
        Dashboard
      </h2>

      <ul className="space-y-2">
        {menu.map((item) => (
          <li
            key={item.name}
            onClick={() => handleMenuClick(item)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
          >
            <span className="text-gray-600">{item.icon}</span>
            <span className="text-gray-700 font-medium">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
