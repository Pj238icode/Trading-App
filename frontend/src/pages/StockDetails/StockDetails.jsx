/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import { Button } from "@/components/ui/button";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  DotIcon,
} from "@radix-ui/react-icons";
import StockChart from "./StockChart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TreadingForm from "./TreadingForm";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoinDetails } from "@/Redux/Coin/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { existInWatchlist } from "@/Util/existInWatchlist";
import { addItemToWatchlist, getUserWatchlist } from "@/Redux/Watchlist/Action";
import { getUserWallet } from "@/Redux/Wallet/Action";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const StockDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { coin, watchlist, auth } = useSelector((store) => store);

  useEffect(() => {
    dispatch(
      fetchCoinDetails({
        coinId: id,
        jwt: auth.jwt || localStorage.getItem("jwt"),
      })
    );
  }, [id]);

  useEffect(() => {
    dispatch(getUserWatchlist());
    dispatch(getUserWallet(localStorage.getItem("jwt")));
  }, []);

  const handleAddToWatchlist = () => {
    dispatch(addItemToWatchlist(coin.coinDetails?.id));
  };

  if (coin.loading) {
    return <SpinnerBackdrop />;
  }

  return (
    <div className="p-6 mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between flex-wrap gap-4">
        {/* Coin Info */}
        <div className="flex gap-4 items-center">
          <Avatar className="h-12 w-12">
            <AvatarImage src={coin.coinDetails?.image?.large} />
          </Avatar>

          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-800">
                {coin.coinDetails?.symbol?.toUpperCase()}
              </p>
              <DotIcon className="text-gray-400" />
              <p className="text-gray-500">{coin.coinDetails?.name}</p>
            </div>

            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-gray-900">
                ${coin.coinDetails?.market_data.current_price.usd}
              </p>
              <p
                className={`text-sm font-medium ${
                  coin.coinDetails?.market_data.market_cap_change_24h < 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {coin.coinDetails?.market_data.market_cap_change_24h} (
                {
                  coin.coinDetails?.market_data
                    .market_cap_change_percentage_24h
                }
                %)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleAddToWatchlist}
            className="h-10 w-10"
            variant="outline"
            size="icon"
          >
            {existInWatchlist(watchlist.items, coin.coinDetails) ? (
              <BookmarkFilledIcon className="h-6 w-6 text-blue-600" />
            ) : (
              <BookmarkIcon className="h-6 w-6 text-gray-500" />
            )}
          </Button>

          <Dialog>
            <DialogTrigger>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                TRADE
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="px-10 pt-5 text-center text-gray-800">
                  How much do you want to spend?
                </DialogTitle>
              </DialogHeader>
              <TreadingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stock Chart */}
      <div className="mt-10">
        <StockChart coinId={coin.coinDetails?.id} />
      </div>
    </div>
  );
};

export default StockDetails;
