import { twoStepVerification } from "@/Redux/Auth/Action";
import CustomeToast from "@/components/custome/CustomeToast";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const TwoFactorAuth = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const { session } = useParams();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  const handleTwoFactoreAuth = () => {
    dispatch(twoStepVerification({ otp: value, session, navigate }));
    console.log(value);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white">
      <CustomeToast show={auth.error} message={auth.error?.error} />
      <Card className="p-10 flex flex-col justify-center items-center shadow-lg bg-white border border-gray-200 rounded-2xl w-[26rem]">
        {/* Avatar / Logo */}
       

        <CardHeader className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Two-Step Verification
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter the 6-digit code sent to your email
          </p>
        </CardHeader>

        <CardContent className="space-y-6 w-full">
          <div className="flex flex-col items-center">
            <InputOTP value={value} onChange={(val) => setValue(val)} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="mt-3 text-gray-400 text-sm text-center">
              Please check your email for the OTP
            </p>
          </div>

          <Button
            onClick={handleTwoFactoreAuth}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            Verify
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuth;
