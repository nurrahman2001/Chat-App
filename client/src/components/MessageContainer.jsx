import React from "react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { FaArrowDownLong } from "react-icons/fa6";
import { PiDownloadSimple } from "react-icons/pi";
import { MdDone } from "react-icons/md";
import { PiChecks } from "react-icons/pi";
import { host } from "../utils/APIRoutes";
import pdf_icon from "../assets/pdf-placeholder.png";

export default function MessageContainer({
    messages,
    scrollRef,
    activeModalIndex,
    setActiveModalIndex,
    showScrollBtn,
    setShowScrollBtn,
    scrollToBottom,
    handleDeleteMessage,
    isOnline
}) {
    return (
        <div className="relative h-screen flex flex-col justify-between bg-cover bg-center">
            <div
                onScroll={(e) => {
                    const element = e.target;
                    const isAtBottom =
                        Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
                    setShowScrollBtn(!isAtBottom);
                }}
                className="flex-1 overflow-y-auto p-4 space-y-3 my-[80px] custom-scrollbar h-full"
            >
                {messages.map((message, index) => {
                    const file = message.file;
                    const isImage = file?.type?.startsWith("image/");
                    const isPDF = file?.type?.includes("pdf");

                    return (
                        <div
                            key={index}
                            ref={index === messages.length - 1 ? scrollRef : null}
                            className={`flex ${message.fromSelf ? "justify-end" : "justify-start"} relative group`}
                        >
                            <div
                                className={`relative max-w-[71%] p-2 rounded-lg shadow-lg text-md ${message.fromSelf
                                    ? "bg-green-200 text-gray-800"
                                    : "bg-blue-600 text-white border border-gray-300"
                                    } flex flex-col`}
                            >
                                {/* Action button */}
                                <IoEllipsisVerticalSharp
                                    size={16}
                                    className={`absolute top-1 text-gray-700 hover:text-gray-900 transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer ${message.fromSelf ? "-left-6" : "-right-6"}`}
                                    onClick={() => setActiveModalIndex((prev) => (prev === index ? null : index))}
                                />

                                <div className="flex-grow break-words">
                                    {/* File Preview */}
                                    {file && file.url && (
                                        <div className="w-full max-w-md relative group">
                                            {isImage && (
                                                <img
                                                    src={`${host}${file.url}`}
                                                    alt={file.name || "Image"}
                                                    className="rounded-md w-full max-w-xs h-auto max-h-50 object-cover cursor-pointer"
                                                    onClick={() => window.open(`${host}${file.url}`, "_blank")}
                                                />
                                            )}
                                            {isPDF && (
                                                <div className="flex flex-col p-2 rounded-md bg-white text-sm">
                                                    <div className="font-semibold mb-1 break-words text-black">
                                                        {file.name || "PDF Document"}
                                                    </div>
                                                    <a
                                                        href={`${host}${file.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center w-full h-full"
                                                        title="Open PDF"
                                                    >
                                                        <img
                                                            src={pdf_icon}
                                                            alt={file.name || "PDF"}
                                                            className="rounded-md w-full max-w-xs h-auto max-h-60 object-cover cursor-pointer p-1"
                                                            onClick={() => window.open(`${host}${file.url}`, "_blank")}
                                                        />
                                                    </a>
                                                </div>
                                            )}

                                            {/* Download button for received files */}
                                            {!message.fromSelf && (
                                                <a
                                                    href={`${host}${file.url}`}
                                                    download={file.url || "download"}
                                                    className="absolute bottom-3 left-3 bg-gray-200 rounded-md p-2 hover:bg-gray-100  group-hover:opacity-100 text-gray-700 font-bold hover:text-gray-800"
                                                    title="download-btn" 
                                                >
                                                    <PiDownloadSimple size={20} />
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Text message */}
                                    {message.message && (
                                        <div className="flex justify-between items-end gap-4 ">
                                            <p className="break-words">{message.message}</p>
                                            <span className="text-xs text-gray-400 whitespace-nowrap mr-3">
                                                {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                }) : ""}
                                            </span>
                                            {message.fromSelf && (
                                                <div className="absolute bottom-2 right-1 text-sm ">
                                                    {isOnline ? (
                                                        <span className="text-blue-500"><PiChecks /></span>
                                                    ) : (
                                                        <span className="text-gray-400"><MdDone /></span>
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                    )}
                                </div>



                                {/* Timestamp for files */}
                                {file?.url && (
                                    <div className="absolute bottom-4 right-7 text-xs text-gray-400 ">
                                        {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        }) : ""}
                                        {message.fromSelf && (
                                            <div className="absolute bottom-0 -right-4 text-sm ">
                                                {isOnline ? (
                                                    <span className="text-blue-500"><PiChecks /></span>
                                                ) : (
                                                    <span className="text-gray-400"><MdDone /></span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                )}


                                {/* Action Modal */}
                                {activeModalIndex === index && (
                                    <div
                                        className={`message-action-modal absolute z-10 bg-white text-gray-800 rounded shadow-lg py-2 text-sm w-32 ${message.fromSelf ? "left-[-145px] top-6" : "right-[-145px] top-6"}`}
                                    >
                                        <div className="flex flex-col">
                                            <button
                                                className="text-left bg-transparent cursor-pointer px-3 py-1 hover:bg-gray-100"
                                                onClick={() => {
                                                    handleDeleteMessage(message.messageId);
                                                    setActiveModalIndex(null);
                                                }}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="text-left bg-transparent cursor-pointer px-3 py-1 hover:bg-gray-100"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(message.message);
                                                    setActiveModalIndex(null);
                                                }}
                                            >
                                                Copy
                                            </button>
                                            <button
                                                className="text-left bg-transparent cursor-pointer px-3 py-1 hover:bg-gray-100"
                                                onClick={() => {
                                                    alert("Forward logic here");
                                                    setActiveModalIndex(null);
                                                }}
                                            >
                                                Forward
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Scroll to bottom button */}


            {showScrollBtn && (

                <div
                    onClick={scrollToBottom}
                    className="fixed bottom-20 right-5 z-[9999] w-10 h-10 bg-white rounded-full shadow-lg hover:bg-gray-100 transition flex items-center justify-center cursor-pointer"
                    title="Scroll to bottom"
                >
                    <FaArrowDownLong size={20} className="text-gray-700" />
                </div>


            )}
        </div>
    );
}
