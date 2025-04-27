import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utils/APIRoutes";

export const SetAvatarPage = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image")) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            toast.error("Please select a valid image file.", toastOptions);
        }
    };

    const setProfilePicture = async () => {
        if (!selectedImage) {
            toast.error("Please select a profile picture!", toastOptions);
            return;
        }

        const formData = new FormData();
        formData.append("avatar", selectedImage);

        try {
            const token = localStorage.getItem("chat-app-token");

            const { data } = await axios.post(setAvatarRoute, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.isSet) {
                toast.success("Avatar set successfully!", toastOptions);
                navigate("/");
            } else {
                toast.error("Error setting profile picture. Please try again.", toastOptions);
            }
        } catch (error) {
            toast.error("Network or server error. Please try again.", toastOptions);
            console.error("Avatar Upload Error:", error);
        }
    };

    return (
        <>
            <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
                <div className="p-8 bg-white rounded-xl shadow-lg flex flex-col items-center gap-6">
                    <h1 className="text-xl font-bold">Set Your Profile Picture</h1>

                    <div className="mb-4">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600">No Image</span>
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 bg-gray-200 rounded-lg cursor-pointer"
                    />

                    <button
                        onClick={setProfilePicture}
                        className="w-full p-3 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase rounded-lg transition duration-300 mt-4 outline-none focus:outline-none"
                    >
                        Set Profile Picture
                    </button>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};
