import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import AccountVarificationForm from "./AccountVarificationForm";
import { VerifiedIcon } from "lucide-react";
import {
  enableTwoStepAuthentication,
  verifyOtp,
} from "@/Redux/Auth/Action";

const Profile = () => {
  const { auth } = useSelector((store) => store);
  console.log(auth)
  const dispatch = useDispatch();

  const handleEnableTwoStepVerification = (otp) => {
    console.log("EnableTwoStepVerification", otp);
    dispatch(
      enableTwoStepAuthentication({
        jwt: localStorage.getItem("jwt"),
        otp,
      })
    );
  };

  const handleVerifyOtp = (otp) => {
    console.log("otp - ", otp);
    dispatch(verifyOtp({ jwt: localStorage.getItem("jwt"), otp }));
  };

  return (
    <div className="flex flex-col items-center mb-10 bg-white min-h-screen text-gray-800">
      <div className="pt-10 w-full lg:w-[60%] px-4">
        {/* ===== User Information ===== */}
        <Card className="bg-white shadow-md border">
          <CardHeader className="pb-9">
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem] font-medium">Email:</p>
                  <p className="text-gray-500">{auth.user?.email}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">Full Name:</p>
                  <p className="text-gray-500">{auth.user?.fullName}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">Date Of Birth:</p>
                  <p className="text-gray-500">10/01/2001</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">Nationality:</p>
                  <p className="text-gray-500">Indian</p>
                </div>
              </div>
              <div className="space-y-7 mt-7 lg:mt-0">
                <div className="flex">
                  <p className="w-[9rem] font-medium">Address:</p>
                  <p className="text-gray-500">Bhubaneswar</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">City:</p>
                  <p className="text-gray-500">Bhubaneswar</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">Postcode:</p>
                  <p className="text-gray-500">751021</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem] font-medium">Country:</p>
                  <p className="text-gray-500">India</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== Two Step Verification ===== */}
        <div className="mt-6">
          <Card className="bg-white shadow-md border w-full">
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                <CardTitle>2 Step Verification</CardTitle>

                {auth.user.twoFactorAuth?.enabled ? (
                  <Badge className="space-x-2 text-white bg-green-600">
                    <VerifiedIcon size={16} /> <span>Enabled</span>
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500 text-white">Disabled</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Enable Two Step Verification
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Verify Your Account
                    </DialogTitle>
                  </DialogHeader>
                  <AccountVarificationForm
                    handleSubmit={handleEnableTwoStepVerification}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* ===== Change Password & Account Status ===== */}
        <div className="lg:flex gap-5 mt-5">
          {/* Change Password */}
          <Card className="bg-white shadow-md border w-full">
            <CardHeader className="pb-7">
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center">
                <p className="w-[8rem] font-medium">Email:</p>
                <p>{auth.user.email}</p>
              </div>
              <div className="flex items-center">
                <p className="w-[8rem] font-medium">Password:</p>
                <Button variant="secondary">Change Password</Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-white shadow-md border w-full mt-5 lg:mt-0">
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                <CardTitle>Account Status</CardTitle>
                {auth.user.verified ? (
                  <Badge className="space-x-2 text-white bg-green-600">
                    <VerifiedIcon size={16} /> <span>Verified</span>
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500 text-white">Pending</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center">
                <p className="w-[8rem] font-medium">Email:</p>
                <p>{auth.user.email}</p>
              </div>
              <div className="flex items-center">
                <p className="w-[8rem] font-medium">Mobile:</p>
                <p>+91 8987667899</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Verify Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Verify Your Account
                    </DialogTitle>
                  </DialogHeader>
                  <AccountVarificationForm handleSubmit={handleVerifyOtp} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
