import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPaymentDetails } from "@/Redux/Withdrawal/Action";
import { maskAccountNumber } from "@/Util/maskAccountNumber";

const PaymentDetails = () => {
  const dispatch = useDispatch();
  const { withdrawal } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getPaymentDetails({ jwt: localStorage.getItem("jwt") }));
  }, []);

  return (
    <div className="px-6 md:px-20 bg-white min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold py-10 text-gray-800">
        Payment Details
      </h1>

      {withdrawal.paymentDetails ? (
        <Card className="mb-10 bg-white border border-gray-200 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              {withdrawal.paymentDetails?.bankName.toUpperCase()}
            </CardTitle>
            <CardDescription className="text-gray-600">
              A/C No:{" "}
              {maskAccountNumber(withdrawal.paymentDetails?.accountNumber)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center py-1">
              <p className="w-32 font-medium text-gray-700">A/C Holder</p>
              <p className="text-gray-600">
                : {withdrawal.paymentDetails.accountHolderName}
              </p>
            </div>
            <div className="flex items-center py-1">
              <p className="w-32 font-medium text-gray-700">IFSC</p>
              <p className="text-gray-600">
                : {withdrawal.paymentDetails.ifsc.toUpperCase()}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Dialog>
          <DialogTrigger>
            <Button className="py-6 text-white bg-blue-600 hover:bg-blue-700 shadow-md">
              Add Payment Details
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-gray-900 p-8 rounded-xl shadow-lg">
            <DialogHeader className="pb-5">
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Payment Details
              </DialogTitle>
            </DialogHeader>
            <PaymentDetailsForm />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentDetails;
