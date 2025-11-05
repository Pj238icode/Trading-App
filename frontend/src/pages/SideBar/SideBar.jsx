import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/Redux/Auth/Action";

// Radix icons
import {
  ExitIcon,
  PersonIcon,
  DashboardIcon,
  HomeIcon,
  BookmarkIcon,
  ActivityLogIcon,
} from "@radix-ui/react-icons";

// Lucide icons
import { CreditCardIcon, BuildingIcon, WalletIcon } from "lucide-react";

const menu = [
  { name: "Home", path: "/", icon: <HomeIcon className="h-5 w-5" /> },
  { name: "Portfolio", path: "/portfolio", icon: <DashboardIcon className="h-5 w-5" /> },
  { name: "Watchlist", path: "/watchlist", icon: <BookmarkIcon className="h-5 w-5" /> },
  { name: "Activity", path: "/activity", icon: <ActivityLogIcon className="h-5 w-5" /> },
  { name: "Wallet", path: "/wallet", icon: <WalletIcon className="h-5 w-5" /> },
  { name: "Payment Details", path: "/payment-details", icon: <BuildingIcon className="h-5 w-5" /> },
  { name: "Withdrawal", path: "/withdrawal", icon: <CreditCardIcon className="h-5 w-5" /> },
  { name: "Profile", path: "/profile", icon: <PersonIcon className="h-5 w-5" /> },
  { name: "Logout", path: "/", icon: <ExitIcon className="h-5 w-5" /> },
];

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMenuClick = (item) => {
    if (item.name === "Logout") handleLogout();
    navigate(item.path);
  };

  return (
    <div className="mt-10 flex flex-col gap-4">
      {menu.map((item) => (
        <div
          key={item.name}
          onClick={() => handleMenuClick(item)}
          className="flex items-center gap-3 cursor-pointer hover:text-orange-500 transition-colors duration-200"
        >
          <span className="w-6">{item.icon}</span>
          <span className="text-lg font-medium">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SideBar;
