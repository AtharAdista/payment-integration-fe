import Navbar from "@/components/common/navbar/navbar";
import { RegisterFormInputsType } from "@/types/auth/register/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputsType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputsType) => {
    try {
      data.role_id = 1;
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/authentication/register`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.errors);
        throw new Error("Register failed");
      }

      setShowSuccessModal(true);

      navigate("/authentication/login");
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleConfirm = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <div className=" flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 rounded-3xl border bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Register
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Email</label>
              <input
                type="text"
                {...register("email", { required: "Email tidak boleh kosong" })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Name</label>
              <input
                type="text"
                {...register("name", { required: "Nama tidak boleh kosong" })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
                placeholder="Enter your Name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}
            </div>

            

            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password tidak boleh kosong",
                })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-400 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errorMessage && (
              <p className="text-red-400 text-sm text-center">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300 transform hover:-translate-y-1"
            >
              Register
            </button>

            <div className="flex flex-row space-x-2 justify-center items-center">
              <p className="text-white">Don't have an account?</p>
              <a
                href="/authentication/login"
                className="text-blue-400 cursor-pointer hover:text-blue-500"
              >
                Sign Up
              </a>
            </div>
          </form>
        </div>

        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-2xl text-center">
              <p className="text-xl font-semibold text-white mb-6">
                Register Successful!
              </p>
              <button
                onClick={handleConfirm}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
