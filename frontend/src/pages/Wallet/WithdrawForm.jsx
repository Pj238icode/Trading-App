import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import "./WithdrawForm.css";
import { useDispatch, useSelector } from "react-redux";
import { withdrawalRequest } from "@/Redux/Withdrawal/Action";
import { DialogClose } from "@/components/ui/dialog";
import { maskAccountNumber } from "@/Util/maskAccountNumber";
import { useNavigate } from "react-router-dom";

const WithdrawForm = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState();
  const { wallet, withdrawal } = useSelector((store) => store);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    if (value.toString().length < 6) {
      setAmount(e.target.value);
    }
  };

  const handleSubmit = () => {
    dispatch(withdrawalRequest({ jwt: localStorage.getItem("jwt"), amount }));
  };

  if (!withdrawal.paymentDetails) {
    return (
      <div className="h-[20rem] flex gap-5 flex-col justify-center items-center bg-white rounded-lg shadow-md">
        <p className="text-2xl font-bold text-gray-900">Add payment method</p>
        <Button onClick={() => navigate("/payment-details")}>
          Add Payment Details
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-10 space-y-5 bg-white p-6 rounded-xl shadow-md">
      {/* Available balance */}
      <div className="flex justify-between items-center rounded-md bg-gray-100 text-xl font-bold px-5 py-4">
        <p className="text-gray-800">Available balance</p>
        <p className="text-gray-900">${wallet.userWallet?.balance}</p>
      </div>

      {/* Amount input */}
      <div className="flex flex-col items-center">
        <h1 className="text-gray-800 mb-2 font-medium">Enter withdrawal amount</h1>
        <div className="flex items-center justify-center w-full">
          <Input
            onChange={handleChange}
            value={amount}
            className="withdrawInput py-7 border border-gray-300 rounded-lg text-2xl text-center focus:ring-2 focus:ring-blue-500"
            placeholder="$9999"
            type="number"
          />
        </div>
      </div>

      {/* Transfer info */}
      <div>
        <p className="pb-2 text-gray-700">Transfer to</p>
        <div className="flex items-center gap-5 border border-gray-300 px-5 py-3 rounded-md bg-gray-50">
          <img
            className="h-8 w-8"
            src="https://cdn.pixabay.com/photo/2020/02/18/11/03/bank-4859142_1280.png"
            alt="bank"
          />
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {withdrawal.paymentDetails?.bankName}
            </p>
            <p className="text-xs text-gray-500">
              {maskAccountNumber(withdrawal.paymentDetails?.accountNumber)}
            </p>
          </div>
        </div>
      </div>

      {/* Withdraw button */}
      <DialogClose className="w-full">
        <Button
          onClick={handleSubmit}
          className="w-full py-7 text-xl bg-blue-600 hover:bg-blue-700 text-white"
        >
          Withdraw {amount && <span className="ml-5">${amount}</span>}
        </Button>
      </DialogClose>
    </div>
  );
};

export default WithdrawForm;
