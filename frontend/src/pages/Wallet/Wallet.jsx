import {
  depositMoney,
  getUserWallet,
  getWalletTransactions,
} from "@/Redux/Wallet/Action";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CopyIcon,
  DownloadIcon,
  ReloadIcon,
  ShuffleIcon,
  UpdateIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { DollarSign, WalletIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopupForm from "./TopupForm";
import TransferForm from "./TransferForm";
import WithdrawForm from "./WithdrawForm";
import { getPaymentDetails } from "@/Redux/Withdrawal/Action";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wallet } = useSelector((store) => store);
  const query = useQuery();
  const paymentId = query.get("payment_id");
  const razorpayPaymentId = query.get("razorpay_payment_id");
  const orderId = query.get("order_id");
  const { order_id } = useParams();

  useEffect(() => {
    if (orderId || order_id) {
      dispatch(
        depositMoney({
          jwt: localStorage.getItem("jwt"),
          orderId: orderId || order_id,
          paymentId: razorpayPaymentId || "AuedkfeuUe",
          navigate,
        })
      );
    }
  }, [paymentId, orderId, razorpayPaymentId]);

  useEffect(() => {
    handleFetchUserWallet();
    handleFetchWalletTransactions();
    dispatch(getPaymentDetails({ jwt: localStorage.getItem("jwt") }));
  }, []);

  const handleFetchUserWallet = () => {
    dispatch(getUserWallet(localStorage.getItem("jwt")));
  };

  const handleFetchWalletTransactions = () => {
    dispatch(getWalletTransactions({ jwt: localStorage.getItem("jwt") }));
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
      () => console.log("Copied!"),
      (err) => console.error("Copy failed: ", err)
    );
  }

  if (wallet.loading) {
    return <SpinnerBackdrop />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4 md:px-10 lg:px-20">
      <div className="w-full lg:w-[60%] space-y-10">
        {/* Wallet Card */}
        <Card className="shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-9">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <WalletIcon className="h-8 w-8 text-gray-700" />
                <div>
                  <CardTitle className="text-2xl font-semibold text-gray-900">
                    My Wallet
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-500 text-sm">
                      #FAVHJY{wallet.userWallet?.id}
                    </p>
                    <CopyIcon
                      onClick={() => copyToClipboard(wallet.userWallet?.id)}
                      className="cursor-pointer hover:text-gray-700"
                    />
                  </div>
                </div>
              </div>
              <ReloadIcon
                onClick={handleFetchUserWallet}
                className="w-6 h-6 cursor-pointer hover:text-gray-500"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="text-gray-600" />
              <span className="text-2xl font-semibold text-gray-800">
                {wallet.userWallet?.balance} USD
              </span>
            </div>

            <div className="flex gap-7 mt-6 flex-wrap">
              {/* Add Money */}
              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:bg-gray-100 text-gray-700 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-md transition">
                    <UploadIcon />
                    <span className="text-sm mt-2">Add Money</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-10 bg-white rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl">
                      Top Up Your Wallet
                    </DialogTitle>
                    <TopupForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              {/* Withdraw */}
              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:bg-gray-100 text-gray-700 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-md transition">
                    <DownloadIcon />
                    <span className="text-sm mt-2">Withdraw</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-10 bg-white rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                      Request Withdrawal
                    </DialogTitle>
                    <WithdrawForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              {/* Transfer */}
              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:bg-gray-100 text-gray-700 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-md transition">
                    <ShuffleIcon />
                    <span className="text-sm mt-2">Transfer</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-10 bg-white rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                      Transfer To Other Wallet
                    </DialogTitle>
                    <TransferForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <div className="pt-10">
          <div className="flex gap-2 items-center pb-5">
            <h1 className="text-2xl font-semibold text-gray-900">History</h1>
            <UpdateIcon
              onClick={handleFetchWalletTransactions}
              className="p-0 h-7 w-7 cursor-pointer hover:text-gray-600"
            />
          </div>

          <div className="space-y-5">
            {wallet.transactions?.length > 0 ? (
              wallet.transactions.map((item, index) => (
                <Card
                  key={index}
                  className="px-5 py-3 flex justify-between items-center bg-white shadow-sm border rounded-md"
                >
                  <div className="flex items-center gap-5">
                    <Avatar>
                      <AvatarFallback>
                        <ShuffleIcon />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h1 className="font-medium text-gray-800">
                        {item.type || item.purpose}
                      </h1>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-medium ${
                      item.amount > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.amount} USD
                  </p>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">
                No transactions found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
