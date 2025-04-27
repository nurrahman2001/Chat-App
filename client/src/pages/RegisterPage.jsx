import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        const token = localStorage.getItem("chat-app-token");
        if (token) {
            navigate("/");
        }
    }, [navigate]);


    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;

        if (!username || username.length < 3) {
            toast.error("Username must be at least 3 characters long", toastOptions);
            return false;
        } else if (!email) {
            toast.error("Email is required", toastOptions);
            return false;
        } else if (password.length < 8) {
            toast.error("Password should be at least 8 characters long", toastOptions);
            return false;
        } else if (password !== confirmPassword) {
            toast.error("Passwords do not match!", toastOptions);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            try {
                const { password, username, email } = values;
                const { data } = await axios.post(registerRoute, {
                    username,
                    email,
                    password,
                });

                if (!data.status) {
                    toast.error(data.msg, toastOptions);
                } else {
                    localStorage.setItem("chat-app-token", data.token);
                    navigate("/");
                }
            } catch {
                toast.error("Something went wrong. Please try again.", toastOptions);
            }
        }
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    return (
        <>
            <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-100">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white px-6 py-4 rounded-2xl flex flex-col gap-6 w-full max-w-sm h-[90%] shadow-lg"
                >
                    <div className="flex flex-col items-center gap-2">
                        <img src={Logo} alt="Logo" className="h-10" />
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        autoComplete="username"
                        value={values.username}
                        onChange={(e) => {
                            let value = e.target.value;
                            if (!value.startsWith("@")) {
                                value = "@" + value.replace(/^@+/, "");
                            }
                            value = value.toLowerCase();

                            // Call your existing handleChange with sanitized value
                            handleChange({ target: { name: "username", value } });
                        }}
                        className="w-full p-3 bg-transparent border border-purple-500 rounded-lg text-lg focus:border-purple-400 outline-none"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        className=" p-3 bg-transparent border border-purple-500 rounded-lg text-lg focus:border-purple-400 outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        className=" p-3 bg-transparent border border-purple-500 rounded-lg  text-lg focus:border-purple-400 outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={handleChange}
                        className=" p-3 bg-transparent border border-purple-500 rounded-lg text-lg focus:border-purple-400 outline-none"
                    />
                    <button
                        type="submit"
                        className=" p-3 bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold uppercase rounded-lg transition duration-300"
                    >
                        Create User
                    </button>
                    <span className=" text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="text-purple-500 font-semibold">
                            Login
                        </Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    );
};
