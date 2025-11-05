import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MagnifyingGlassIcon, DragHandleHorizontalIcon } from "@radix-ui/react-icons";
import SideBar from "../SideBar/SideBar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleAvatarClick = () => {
    if (auth.user) {
      auth.user.role === "ROLE_ADMIN" ? navigate("/admin/withdrawal") : navigate("/profile");
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 px-4 py-3 flex justify-between items-center shadow-md">
      {/* Left side - Sidebar & Logo */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <DragHandleHorizontalIcon className="h-6 w-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-2xl font-bold text-orange-500">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png" />
                  <AvatarFallback>BTC</AvatarFallback>
                </Avatar>
                MarketDock
              </SheetTitle>
            </SheetHeader>
            <SideBar />
          </SheetContent>
        </Sheet>

        <p onClick={() => navigate("/")} className="text-white text-lg cursor-pointer">
          MarketDock
        </p>
      </div>

      {/* Middle - Search */}
      <div className="flex flex-1 max-w-md mx-4">
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full bg-gray-800 text-white placeholder-gray-400 border-none focus:ring-0"
        />
        <Button variant="outline" className="ml-2 px-3" onClick={handleSearch}>
          <MagnifyingGlassIcon className="text-white" />
        </Button>
      </div>

      {/* Right side - Avatar */}
      <div>
        <Avatar className="cursor-pointer" onClick={handleAvatarClick}>
          {!auth.user ? (
            <AvatarFallback className="text-white">U</AvatarFallback>
          ) : (
            <AvatarFallback>{auth.user.fullName[0].toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
      </div>
    </div>
  );
};

export default Navbar;
