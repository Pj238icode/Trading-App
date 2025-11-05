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
import { enableTwoStepAuthentication, verifyOtp } from "@/Redux/Auth/Action";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleEnableTwoStepVerification = async (otp) => {
    try {
      await dispatch(enableTwoStepAuthentication({ jwt: localStorage.getItem("jwt"), otp }));
      toast({ title: "Success", description: "Two-step verification enabled!" });
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed to enable 2FA." });
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      await dispatch(verifyOtp({ jwt: localStorage.getItem("jwt"), otp }));
      toast({ title: "Success", description: "Account verified successfully!" });
    } catch (err) {
      toast({ title: "Error", description: err.message || "OTP verification failed." });
    }
  };

  return (
    <div className="flex flex-col items-center mb-5">
      <div className="pt-10 w-full lg:w-[60%]">
        {/* User Info Card */}
        <Card>
          <CardHeader className="pb-9">
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">Email :</p>
                  <p className="text-gray-500">{auth.user?.email}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem]">Full Name :</p>
                  <p className="text-gray-500">{auth.user?.fullName}</p>
                </div>
                {/* Add more fields as needed */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Step Verification Card */}
        <div className="mt-6">
          <Card className="w-full">
            <CardHeader className="pb-7 flex items-center gap-3">
              <CardTitle>2 Step Verification</CardTitle>
              {auth.user?.twoFactorAuth?.enabled ? (
                <Badge className="space-x-2 text-white bg-green-600">
                  <VerifiedIcon /> <span>Enabled</span>
                </Badge>
              ) : (
                <Badge className="bg-orange-500">Disabled</Badge>
              )}
            </CardHeader>
            <CardContent>
              {!auth.user?.twoFactorAuth?.enabled && (
                <Dialog>
                  <DialogTrigger>
                    <Button>Enable Two Step Verification</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="px-10 pt-5 text-center">
                        Verify your account
                      </DialogTitle>
                    </DialogHeader>
                    <AccountVarificationForm handleSubmit={handleEnableTwoStepVerification} />
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Verification Card */}
        <div className="lg:flex gap-5 mt-5">
          <Card className="w-full">
            <CardHeader className="pb-7 flex items-center gap-3">
              <CardTitle>Account Status</CardTitle>
              {auth.user?.verified ? (
                <Badge className="space-x-2 text-white bg-green-600">
                  <VerifiedIcon /> <span>Verified</span>
                </Badge>
              ) : (
                <Badge className="bg-orange-500">Pending</Badge>
              )}
            </CardHeader>
            <CardContent>
              {!auth.user?.verified && (
                <Dialog>
                  <DialogTrigger>
                    <Button>Verify Account</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="px-10 pt-5 text-center">
                        Enter OTP to verify account
                      </DialogTitle>
                    </DialogHeader>
                    <AccountVarificationForm handleSubmit={handleVerifyOtp} />
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
