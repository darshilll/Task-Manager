/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../redux/slices/authApiSlice";
import { toast } from "sonner";
import { setCredentials } from "../redux/slices/authSlice";
import Loader from "../components/Loader";

const Login = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-gradient-to-t from-[#9FA5D5] to-[#E8F5C8]">
      <div className="md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* left side */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="md:max-w-lg 2xl:max-w-3xl flex flex-col items-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base text-gray-700">
              Manage all your task in one place!
            </span>
            <p className="flex flex-col md:gap-4 text-4xl md:text-6xl 2xl:text-6xl font-black text-center text-black select-none">
              <span>Your digital </span>
              <span className="">task assistant</span>
            </p>

            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>
        {/* right side */}
        <div className="md:1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-[#fdf4e5] px-10 py-14"
          >
            <div>
              <img
                src="/assets/images/taska2.png"
                alt="taska"
                className="-mt-10"
              />
              <p className="text-gray-800 text-2xl  text-center tracking-wide -mt-2">
                Welcome back!
              </p>
              <p className="text-center text-base text-gray-600">
                Keep all your credential safe.
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="email"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder="password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-full"
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <span className="text-sm text-gray-700 hover:text-blue-600 hover:underline cursor-pointer">
                Forget Password?
              </span>

              {isLoading ? (
                <Loader />
              ) : (
                <Button
                  type="submit"
                  label="Login"
                  className="w-full h-10 bg-black text-white rounded-full font-bold hover:bg-gray-800"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
