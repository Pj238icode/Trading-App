import { useEffect, useState } from "react";
import { addItemToWatchlist, getUserWatchlist } from "@/Redux/Watchlist/Action";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";

const Watchlist = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { watchlist } = useSelector((store) => store);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserWatchlist());
  }, [page, dispatch]);

  const handleAddToWatchlist = (id) => {
    dispatch(addItemToWatchlist(id));
  };

  return (
    <div className="pt-8 lg:px-10 bg-white min-h-screen">
      <div className="flex items-center pt-5 pb-10 gap-5">
        <BookmarkFilledIcon className="h-10 w-10 text-gray-800" />
        <h1 className="text-4xl font-semibold text-gray-900">Watchlist</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <ScrollArea>
          <Table className="w-full text-gray-800">
            <TableHeader>
              <TableRow className="bg-white sticky top-0 left-0 right-0 border-b">
                <TableHead className="py-4 text-gray-700 font-semibold">Coin</TableHead>
                <TableHead className="text-gray-700 font-semibold">Symbol</TableHead>
                <TableHead className="text-gray-700 font-semibold">Volume</TableHead>
                <TableHead className="text-gray-700 font-semibold">Market Cap</TableHead>
                <TableHead className="text-gray-700 font-semibold">24H</TableHead>
                <TableHead className="text-gray-700 font-semibold">Price</TableHead>
                <TableHead className="text-right text-red-700 font-semibold">Remove</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {watchlist.items?.length > 0 ? (
                watchlist.items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <TableCell
                      onClick={() => navigate(`/market/${item.id}`)}
                      className="font-medium flex items-center gap-2"
                    >
                      <Avatar>
                        <AvatarImage src={item.image} alt={item.symbol} />
                      </Avatar>
                      <span>{item.name}</span>
                    </TableCell>
                    <TableCell>{item.symbol.toUpperCase()}</TableCell>
                    <TableCell>{item.total_volume}</TableCell>
                    <TableCell>{item.market_cap}</TableCell>
                    <TableCell
                      className={`${
                        item.market_cap_change_percentage_24h < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.market_cap_change_percentage_24h}%
                    </TableCell>
                    <TableCell>${item.current_price}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleAddToWatchlist(item.id)}
                        className="h-10 w-10"
                        variant="outline"
                        size="icon"
                      >
                        <BookmarkFilledIcon className="h-6 w-6 text-gray-700" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-gray-500"
                  >
                    No items in your watchlist.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Watchlist;
