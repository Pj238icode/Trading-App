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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { sendResetPassowrdOTP } from "@/Redux/Auth/Action";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPasswordForm = () => {
  const [verificationType, setVerificationType] = useState("EMAIL");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    data.navigate = navigate;
    dispatch(sendResetPassowrdOTP({ sendTo: data.email, navigate, verificationType }));
    console.log("Forgot Password form", data);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0mYrMs-BuUY3LS5-Rq6Mg0Wbqu_EoJDXomg&s"
          alt="App Logo"
          className="w-16 h-16 rounded-full shadow-md"
        />
      </div>

      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Forgot Password?
      </h1>

      <p className="text-center text-gray-600 mb-4">
        Enter your registered email address to receive an OTP for password reset.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="w-full py-4 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-lg"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all rounded-lg"
          >
            Send OTP
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-gray-500 mt-5">
        <p>
          Remember your password?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-600 hover:underline"
          >
            Back to Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
