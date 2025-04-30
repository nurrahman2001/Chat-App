import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes, FaVolumeUp, FaMicrophoneSlash, FaMicrophone } from "react-icons/fa";
import { io } from "socket.io-client";
import dummyUser from "../assets/blank_image.jpg";
import { host } from "../utils/APIRoutes";
import { useUser } from "../context/UserContext";

const socket = io(host);

export const CallPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useUser();

  const { currentChat, callType, offer, isIncoming } = location.state || {};
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const timerRef = useRef(null);


  const cleanupCall = () => {

    clearInterval(timerRef.current);
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
  };

  const startCall = async () => {
    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerConnection.current = peer;
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      // Handle remote tracks
      peer.ontrack = (event) => {
        console.log("Remote track received type:", event.track.kind);
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          console.log("Remote stream connected to video element");
        }
      };

      // Send ICE candidates
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            to: currentChat.userId,
          });
        }
      };

      // Monitor connection state
      peer.onconnectionstatechange = () => {
        console.log("Connection state:", peer.connectionState);
        if (peer.connectionState === 'connected') {
          setCallStatus("Call Connected");
          startCallTimer();
        } else if (
          peer.connectionState === 'disconnected' ||
          peer.connectionState === 'failed' ||
          peer.connectionState === 'closed'
        ) {
          endCall();
        }
      };

      // Create and send offer
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      const callData = {
        to: currentChat.userId,
        from: currentUser.user._id,
        name: currentUser.user.username,
        avatar: currentUser.user.avatarImage,
        callType,
        offer,
      };

      socket.emit("call-user", callData);

      setIsCalling(true);
      setCallStatus("Calling...");
    } catch (err) {
      console.error("Error starting call:", err);
      alert("Could not access camera/microphone. Please check permissions.");
      navigate(-1);
    }
  };

  const endCall = () => {
    clearInterval(timerRef.current);
    setIsCalling(false);
    setCallStatus("");

    // Notify other party about call ending
    const recipientId = currentChat.userId || currentChat.contactId;

    if (recipientId) {
      socket.emit("call-ended", { to: recipientId });
    }

    // Clean up resources
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    navigate(-1);
  };

  const handleIncomingCall = async () => {
    try {
      // Request media based on call type
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnection.current = peer;

      // Add tracks to peer connection
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      // Handle remote tracks
      peer.ontrack = (event) => {
        console.log("Remote track received:", event.track.kind);
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          console.log("Remote stream connected to video element");
        }
      };

      // Send ICE candidates
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            to: currentChat.userId || currentChat.contactId,
          });
        }
      };

      // Monitor connection state
      peer.onconnectionstatechange = () => {
        console.log("Connection state:", peer.connectionState);
        if (peer.connectionState === 'connected') {
          setCallStatus("Call Connected");
          startCallTimer();
        } else if (
          peer.connectionState === 'disconnected' ||
          peer.connectionState === 'failed' ||
          peer.connectionState === 'closed'
        ) {
          endCall();
        }
      };

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      // Create answer
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      // Send answer
      socket.emit("call-answer", {
        to: currentChat.userId || currentChat.contactId,
        from: currentUser.user._id,
        answer,
      });

      setIsCalling(true);
      setCallStatus("Connecting...");
    } catch (err) {
      console.error("Error handling incoming call:", err);
      alert("Could not access camera/microphone. Please check permissions.");
      navigate(-1);
    }
  };

  const startCallTimer = () => {
    // Clear any existing timer
    clearInterval(timerRef.current);
    setCallDuration(0);

    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };



  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!audioTracks[0]?.enabled);
    }
  };

  const toggleSpeaker = () => {
    setSpeakerOn((prev) => !prev);
    // Web browsers don't have direct speaker control API
  };

  useEffect(() => {
    if (!currentChat) {
      navigate("/");
      return;
    }

    if (isIncoming && offer) {
      // Handle incoming call
      handleIncomingCall();
    } else if (currentChat && callType) {
      // Make outgoing call
      startCall();
    }

    // Clean up on unmount
    return () => {
      cleanupCall();
    };
  }, [currentChat, callType, isIncoming, offer]);

  // Set up socket event listeners
  useEffect(() => {
    // For outgoing calls: handle the answer
    socket.on("call-answered", async ({ answer }) => {
      console.log("Call answered, setting remote description");
      if (peerConnection.current) {
        try {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          setCallStatus("Connecting...");
        } catch (err) {
          console.error("Error setting remote description:", err);
        }
      }
    });

    // Handle ICE candidates from remote peer
    socket.on("ice-candidate", async ({ candidate }) => {
      console.log("Received ICE candidate");
      if (peerConnection.current && candidate) {
        try {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    });

    // Handle call rejection
    socket.on("call-rejected", () => {
      console.log("Call rejected by remote peer");
      endCall();
    });

    // Handle call ending
    socket.on("call-ended", () => {
      console.log("Call ended by remote peer");
      endCall();
    });

    return () => {
      // Clean up event listeners
      socket.off("call-answered");
      socket.off("ice-candidate");
      socket.off("call-rejected");
      socket.off("call-ended");

      // Clean up call resources
      cleanupCall();
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-[100vw] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-lg h-[90vh] bg-white rounded-2xl shadow-xl p-8 relative">
        {/* User Info */}
        <div className="flex flex-col items-center">
          <img
            src={
              currentChat?.avatarImage
                ? `${host}${currentChat.avatarImage}`
                : dummyUser
            }
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow"
          />
          <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-1">
            {currentChat?.contactName}
          </h3>
        </div>

        {/* Call Status & Video */}
        {isCalling && (
          <div className="flex flex-col items-center mt-6">
            {callStatus === "Calling..." || callStatus === "Connecting..." ? (
              <p className="text-lg font-medium text-blue-600">{callStatus}</p>
            ) : (
              <p className="text-sm text-gray-500">
                {formatTime(callDuration)}
              </p>
            )}

            {callType === "video" ? (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <video
                  ref={localVideoRef}
                  className="w-36 h-36 rounded-xl border-2 border-blue-300 shadow"
                  autoPlay
                  muted
                />
                <video
                  ref={remoteVideoRef}
                  className="w-36 h-36 rounded-xl border-2 border-blue-300 shadow"
                  autoPlay
                />
              </div>
            ) : (
              <p className="text-gray-500 mt-3">Audio Call in Progress</p>
            )}
          </div>
        )}

        {/* Controls */}
        {isCalling && (
          <div className="flex justify-center items-center gap-8 mt-8">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full outline-none focus:outline-none shadow transition ${isMuted ? "bg-yellow-500" : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {isMuted ? (
                <FaMicrophoneSlash className="text-white" size={20} />
              ) : (
                <FaMicrophone className="text-gray-700" size={20} />
              )}
            </button>

            <button
              onClick={toggleSpeaker}
              className={`p-4 rounded-full outline-none focus:outline-none shadow transition ${speakerOn ? "bg-green-500" : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              <FaVolumeUp
                className={`${speakerOn ? "text-white" : "text-gray-700"}`}
                size={20}
              />
            </button>

            <button
              onClick={endCall}
              className="p-4 rounded-full outline-none focus:outline-none bg-red-500 hover:bg-red-600 shadow"
            >
              <FaTimes className="text-white" size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};