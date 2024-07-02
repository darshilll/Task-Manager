/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../redux/slices/authApiSlice";
import { toast } from "sonner";
import { setCredentials } from "../redux/slices/authSlice";
import Loader from "../components/Loader";

const Signup = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   const [login, { isLoading }] = useLoginMutation();
  const [signup, { isLoading }] = useRegisterMutation();

  const submitHandler = async (data) => {
    try {
      const result = await signup(data).unwrap();
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
          <div className="md:max-w-lg 2xl:max-w-3xl flex flex-col items-center gap-5  2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base text-gray-700">
              Manage all your task in one place!
            </span>
            <img src="/assets/images/taska2p.png" alt="taska" />
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
            className="form-container w-full md:w-[400px] flex flex-col gap-y-7 bg-[#fdf4e5] px-10 py-14"
          >
            <div>
              <p className="text-gray-800 text-xl  text-center font-bold -mt-3">
                Simplify Your Task Management
              </p>
              <p className="text-center text-base text-gray-600">
                Get started, stay ahead.
              </p>
            </div>

            <div className="flex flex-col gap-y-6">
              <Textbox
                placeholder="Email"
                type="email"
                name="email"
                className="w-full rounded-lg"
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder="Name"
                type="name"
                name="name"
                className="w-full rounded-lg"
                register={register("name", {
                  required: "Name is required!",
                })}
                error={errors.name ? errors.name.message : ""}
              />
              <Textbox
                placeholder="Password"
                type="password"
                name="password"
                className="w-full rounded-lg"
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <Textbox
                placeholder="Role"
                type="text"
                name="title"
                className="w-full rounded-lg"
                register={register("title", {
                  required: "title is required!",
                })}
                error={errors.title ? errors.title.message : ""}
              />

              {isLoading ? (
                <Loader />
              ) : (
                <Button
                  type="submit"
                  label="Sign up"
                  className="w-full h-10 bg-black text-white rounded-lg font-bold hover:bg-gray-800"
                />
              )}
              <p className="text-center">
                Already have an account?
                <Link
                  to="/login"
                  className="hover:text-blue-600 hover:underline ml-1"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Signup;