/* eslint-disable no-unused-vars */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "@/Redux/Assets/Action";
import { getAllOrdersForUser } from "@/Redux/Order/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { calculateProfite } from "@/Util/calculateProfite";
import { readableDate } from "@/Util/readableDate";

const TreadingHistory = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt")));
    dispatch(getAllOrdersForUser({ jwt: localStorage.getItem("jwt") }));
  }, [dispatch]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="sticky top-0 left-0 right-0 bg-white z-10">
            <TableHead>Date & Time</TableHead>
            <TableHead>Trading Pair</TableHead>
            <TableHead>Buy Price</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Order Type</TableHead>
            <TableHead>Profit/Loss</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {order.orders?.length > 0 ? (
            order.orders.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <p>{readableDate(item.timestamp).date}</p>
                  <p className="text-gray-400 text-sm">
                    {readableDate(item.timestamp).time}
                  </p>
                </TableCell>
                <TableCell className="flex items-center gap-3 font-medium">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={item.orderItem.coin.image}
                      alt={item.orderItem.coin.symbol}
                    />
                  </Avatar>
                  <span>{item.orderItem.coin.name}</span>
                </TableCell>
                <TableCell>${item.orderItem.buyPrice}</TableCell>
                <TableCell>
                  {item.orderItem.sellPrice
                    ? "$" + item.orderItem.sellPrice
                    : "-"}
                </TableCell>
                <TableCell>{item.orderType}</TableCell>
                <TableCell
                  className={`${
                    calculateProfite(item) < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {item.orderType === "SELL"
                    ? `$${calculateProfite(item).toFixed(2)}`
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  ${item.price.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-gray-500"
              >
                No trade history available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TreadingHistory;
