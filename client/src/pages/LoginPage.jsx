import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        password: "",
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
        const { password, username } = values;
        if (!username || !password) {
            toast.error("Username and Password are required!", toastOptions);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            try {
                const { password, username } = values;
                const { data } = await axios.post(loginRoute, { username, password });

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
                    className="bg-white p-8 rounded-2xl flex flex-col gap-6 w-full max-w-sm shadow-lg"
                >
                    <div className="flex flex-col items-center gap-2">
                        <img src={Logo} alt="Logo" className="h-12" />
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
                        type="password"
                        placeholder="Password"
                        name="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                        className="w-full p-3 bg-transparent border border-purple-500 rounded-lg text-lg focus:border-purple-400 outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full p-3 bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold uppercase rounded-lg transition duration-300"
                    >
                        Log In
                    </button>
                    <span className=" text-center">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-purple-500 font-semibold">
                            Register
                        </Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    );
};
