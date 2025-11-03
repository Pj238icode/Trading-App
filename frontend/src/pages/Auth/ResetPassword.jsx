import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { verifyResetPassowrdOTP } from "@/Redux/Auth/Action";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import * as yup from "yup";

const formSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords & Confirm Password must match")
    .min(8, "Password must be at least 8 characters long")
    .required("Confirm password is required"),
  otp: yup
    .string()
    .min(6, "OTP must be at least 6 characters long")
    .required("OTP is required"),
});

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { session } = useParams();
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
      otp: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(
      verifyResetPassowrdOTP({ otp: data.otp, password: data.password, session, navigate })
    );
    console.log("Reset Password Form", data);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <Card className="p-10 flex flex-col items-center justify-center h-[35rem] w-[30rem] shadow-lg bg-white border border-gray-200 rounded-2xl">
        <div className="space-y-5 w-full">
          <h1 className="text-center text-2xl font-semibold pb-5 text-gray-800">
            Reset Your Password
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* OTP Section */}
              <h2 className="pb-2 text-gray-700 font-medium">Verify OTP</h2>
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP {...field} maxLength={6}>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Section */}
              <h2 className="pt-7 pb-2 text-gray-700 font-medium">
                Change Password
              </h2>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="border w-full border-gray-300 py-5 px-5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="New password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="border w-full border-gray-300 py-5 px-5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Confirm password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Change Password
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
