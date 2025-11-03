/* eslint-disable no-unused-vars */
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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/Redux/Auth/Action";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const formSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const SignupForm = () => {
  const { auth } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    data.navigate = navigate;
    dispatch(register(data));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0mYrMs-BuUY3LS5-Rq6Mg0Wbqu_EoJDXomg&s"
          alt="App Logo"
          className="w-16 h-16 rounded-full shadow-md"
        />
      </div>  
      {/* Header */}
      <h2 className="text-center text-2xl font-semibold text-gray-800">
        Create New Account
      </h2>




      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border border-gray-300 py-3 px-4 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition w-full"
                    placeholder="Full name"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="border border-gray-300 py-3 px-4 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition w-full"
                    placeholder="Email address"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="border border-gray-300 py-3 px-4 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition w-full"
                    placeholder="Password"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          {!auth.loading ? (
            <Button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg transition"
            >
              Register
            </Button>
          ) : (
            <SpinnerBackdrop show={true} />
          )}
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
