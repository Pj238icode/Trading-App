/* eslint-disable no-unused-vars */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "@/Redux/Assets/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import TreadingHistory from "./TreadingHistory";

const Portfolio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("portfolio");
  const { asset } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt")));
  }, [dispatch]);

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-10 py-5 mt-10">
      {/* Dropdown */}
      <div className="pb-5 flex items-center gap-5">
        <Select onValueChange={handleTabChange} defaultValue="portfolio">
          <SelectTrigger className="w-[180px] py-[1.2rem] bg-white border-gray-300">
            <SelectValue placeholder="Select Portfolio" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="portfolio">Portfolio</SelectItem>
            <SelectItem value="history">History</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Portfolio Table */}
      {currentTab === "portfolio" ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <Table className="min-w-full bg-white">
            <TableHeader>
              <TableRow className="sticky top-0 bg-white z-10 border-b">
                <TableHead className="py-3 text-gray-700">Assets</TableHead>
                <TableHead className="text-gray-700">Price</TableHead>
                <TableHead className="text-gray-700">Unit</TableHead>
                <TableHead className="text-gray-700">Change</TableHead>
                <TableHead className="text-gray-700">Change (%)</TableHead>
                <TableHead className="text-right text-gray-700">Value</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {asset.userAssets?.length > 0 ? (
                asset.userAssets.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => navigate(`/market/${item.coin.id}`)}
                    className="hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <TableCell className="font-medium flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={item.coin.image}
                          alt={item.coin.symbol}
                        />
                      </Avatar>
                      <span className="text-gray-800">{item.coin.name}</span>
                    </TableCell>
                    <TableCell className="text-gray-800">
                      ${item.coin.current_price}
                    </TableCell>
                    <TableCell className="text-gray-800">
                      {item.quantity}
                    </TableCell>
                    <TableCell
                      className={`${
                        item.coin.price_change_percentage_24h < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.coin.price_change_24h}
                    </TableCell>
                    <TableCell
                      className={`${
                        item.coin.price_change_percentage_24h < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.coin.price_change_percentage_24h}%
                    </TableCell>
                    <TableCell className="text-right text-gray-800">
                      ${(item.coin.current_price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    No assets found in your portfolio.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <TreadingHistory />
      )}
    </div>
  );
};

export default Portfolio;
