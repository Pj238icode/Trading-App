/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { AssetTable } from "./AssetTable";
import { Button } from "@/components/ui/button";
import StockChart from "../StockDetails/StockChart";
import {
  ChevronLeftIcon,
  Cross1Icon,
  DotIcon,
} from "@radix-ui/react-icons";
import { MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoinDetails,
  fetchCoinList,
  fetchTreadingCoinList,
  getTop50CoinList,
} from "@/Redux/Coin/Action";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { sendMessage } from "@/Redux/Chat/Action";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const Home = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const { coin, chatBot, auth } = useSelector((store) => store);
  const [isBotRelease, setIsBotRelease] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCoinList(page));

  }, [page]);

  useEffect(() => {
    dispatch(
      fetchCoinDetails({
        coinId: "bitcoin",
        jwt: auth.jwt || localStorage.getItem("jwt"),
      })
    );
  }, []);

  useEffect(() => {
    if (category === "top50") {
      dispatch(getTop50CoinList());
    } else if (category === "trading") {
      dispatch(fetchTreadingCoinList());
    }
  }, [category]);

  const handlePageChange = (page) => setPage(page);
  const handleBotRelease = () => setIsBotRelease(!isBotRelease);
  const handleChange = (e) => setInputValue(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      dispatch(
        sendMessage({
          prompt: inputValue,
          jwt: auth.jwt || localStorage.getItem("jwt"),
        })
      );
      setInputValue("");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatBot.messages]);

  if (coin.loading) {
    return <SpinnerBackdrop />;
  }

  return (
    <div className="relative min-h-screen bg-white text-gray-800">
      <div className="lg:flex gap-5 p-4">
        {/* Left Section - Coin List */}
        <div className="lg:w-[48%] bg-gray-50 rounded-2xl shadow-sm border">
          <div className="p-3 flex items-center gap-3 border-b">
            {["all", "top50"].map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                onClick={() => setCategory(cat)}
                className="rounded-full capitalize"
              >
                {cat === "all" ? "All Coins" : "Top 50"}
              </Button>
            ))}
          </div>
          <AssetTable
            category={category}
            coins={category === "all" ? coin.coinList : coin.top50}
          />
          {category === "all" && (
            <Pagination className="border-t py-3 bg-white rounded-b-2xl">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                </PaginationItem>
                {[1, 2, 3].map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      onClick={() => handlePageChange(num)}
                      isActive={page === num}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {page > 3 && (
                  <PaginationItem>
                    <PaginationLink isActive>{page}</PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className="cursor-pointer"
                    onClick={() => handlePageChange(page + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Right Section - Stock Chart */}
        <div className="hidden lg:flex flex-col gap-5 lg:w-[50%] bg-gray-50 rounded-2xl shadow-sm border p-5">
          <StockChart coinId={"bitcoin"} />
          <div className="flex gap-4 items-center border-t pt-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={coin.coinDetails?.image?.thumb} alt={coin.coinDetails?.name} />
             
            </Avatar>

            <div>
              <div className="flex items-center gap-2 text-gray-700">
                <p className="font-semibold text-base uppercase">
                  {coin.coinDetails?.symbol}
                </p>
                <DotIcon className="text-gray-400" />
                <p className="text-gray-500">{coin.coinDetails?.name}</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-xl font-bold text-gray-900">
                  ${coin.coinDetails?.market_data.current_price.usd}
                </p>
                <p
                  className={`text-sm font-medium ${coin.coinDetails?.market_data.market_cap_change_24h < 0
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
        </div>
      </div>

      {/* ChatBot Section */}
      <section className="absolute bottom-5 right-5 z-40 flex flex-col justify-end items-end gap-2">
        {isBotRelease && (
          <div className="rounded-2xl border bg-white shadow-lg w-[20rem] md:w-[25rem] lg:w-[25rem] h-[70vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b px-6 h-[12%] bg-gray-100">
              <p className="font-semibold text-gray-800">Crypto ChatBot</p>
              <Button onClick={handleBotRelease} size="icon" variant="ghost">
                <Cross1Icon />
              </Button>
            </div>

            <div className="h-[76%] flex flex-col overflow-y-auto gap-4 px-5 py-2">
              <div className="self-start">
                <div className="px-5 py-3 rounded-xl bg-gray-100 text-sm text-gray-700 shadow-sm">
                  Hi, {auth.user?.fullName}! 👋
                  <p>Ask anything about crypto — price, market cap, etc.</p>
                </div>
              </div>
              {chatBot.messages.map((item, index) => (
                <div
                  ref={chatContainerRef}
                  key={index}
                  className={`pb-3 ${item.role === "user" ? "self-end" : "self-start"
                    }`}
                >
                  {item.role === "user" ? (
                    <div className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm max-w-[80%]">
                      {item.prompt}
                    </div>
                  ) : (
                    <div className="px-5 py-3 rounded-xl bg-gray-100 text-sm text-gray-700 shadow-sm max-w-[80%]">
                      {item.ans}
                    </div>
                  )}
                </div>
              ))}
              {chatBot.loading && (
                <p className="text-gray-400 text-center text-sm">
                  Fetching data...
                </p>
              )}
            </div>

            <div className="h-[12%] border-t bg-gray-50">
              <Input
                className="w-full h-full border-none outline-none bg-transparent"
                placeholder="Type your question..."
                onChange={handleChange}
                value={inputValue}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        )}
        <div
          onClick={handleBotRelease}
          className="relative w-[10rem] cursor-pointer group"
        >
          <Button className="w-full h-[3rem] gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white">
            <MessageCircle size={24} />
            <span className="text-lg font-semibold">Chat Bot</span>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
