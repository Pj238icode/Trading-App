import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AvatarIcon,
  DragHandleHorizontalIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import SideBar from "../SideBar/SideBar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  const handleNavigate = () => {
    if (auth.user) {
      auth.user.role === "ROLE_ADMIN"
        ? navigate("/admin/withdrawal")
        : navigate("/profile");
    }
  };

  return (
    <>
      <nav className="px-4 py-3   border-b border-gray-200 bg-white shadow-sm sticky top-0 left-0 right-0 z-50 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Sidebar trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="rounded-full h-10 w-10"
                variant="ghost"
                size="icon"
              >
                <DragHandleHorizontalIcon className="h-6 w-6 text-gray-700" />
              </Button>
            </SheetTrigger>


            <SheetContent
              className="w-72 border-r-0 flex flex-col justify-center"
              side="left"
            >
              <SheetHeader>
                <SheetTitle>
                  <div className="text-2xl mt-20 flex justify-center items-center gap-2 font-semibold">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0mYrMs-BuUY3LS5-Rq6Mg0Wbqu_EoJDXomg&s" />
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-orange-600">Market</span>
                      <span className="text-gray-700">Dock</span>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <SideBar />
            </SheetContent>
          </Sheet>

          {/* Brand Name */}
          <p
            onClick={() => navigate("/")}
            className="text-lg font-semibold text-gray-800 cursor-pointer tracking-wide"
          >
            <div className="text-2xl mt-2 flex justify-center items-center gap-2 font-semibold">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0mYrMs-BuUY3LS5-Rq6Mg0Wbqu_EoJDXomg&s" />
              </Avatar>
              <div className="flex flex-col">
                <span className="font-bold text-orange-600">Market</span><span className="text-gray-700">Dock</span>
              </div>
            </div>
          </p>

          {/* Search Button */}
          <div className="hidden sm:block ml-8">
            <Button
              variant="outline"
              onClick={() => navigate("/search")}
              className="flex items-center gap-2"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Search</span>
            </Button>
          </div>
        </div>

        {/* Right Section (Avatar) */}
        <div>
          <Avatar className="cursor-pointer" onClick={handleNavigate}>
            {!auth.user ? (
              <AvatarIcon className="h-8 w-8 text-gray-700" />
            ) : (
              <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
                {auth.user?.fullName[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
