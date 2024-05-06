import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import "./VideoChat.css";

const VideoChat = ({ socket, username, room }) => {
  const [stream, setStream] = useState(null);
  const [otherUser, setOtherUser] = useState("");
  const [peer, setPeer] = useState(null);
  const [initiator, setInitiator] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getUserMedia();
  }, []);

  const initiateCall = () => {
    const p = new SimplePeer({ initiator: true, stream });
    p.on("signal", (data) => {
      setPeer(p);
      socket.emit("call_user", { signal: data, to: otherUser });
    });
    setInitiator(true);
  };

  const handleCallSignal = (signal) => {
    if (!initiator) {
      const p = new SimplePeer({ initiator: false, stream });
      p.on("signal", (data) => {
        setPeer(p);
        socket.emit("answer_call", { signal, to: otherUser });
      });
      p.signal(signal);
    }
  };

  useEffect(() => {
    socket.on("call_accepted", (data) => {
      setOtherUser(data.from);
      handleCallSignal(data.signal);
    });

    socket.on("call_user", (data) => {
      setOtherUser(data.from);
      initiateCall();
    });

    return () => {
      socket.off("call_accepted");
      socket.off("call_user");
    };
  }, [socket, initiateCall, handleCallSignal]);

  useEffect(() => {
    if (peer) {
      peer.on("stream", (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });
    }
  }, [peer]);

  useEffect(() => {
    const playStream = () => {
      if (stream) {
        const video = localVideoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      }
    };

    playStream();
  }, [stream]);

  return (
    <div className="video-chat">
      <div className="video-container">
        <div className="video-wrapper">
          <video ref={localVideoRef} autoPlay muted className="local-video"></video>
          <p className="username">{username}</p>
        </div>
        <div className="video-wrapper">
          <video ref={remoteVideoRef} autoPlay className="remote-video"></video>
          <p className="username">{otherUser}</p>
        </div>
      </div>
      <div className="actions">
        <input
          type="text"
          value={otherUser}
          onChange={(e) => setOtherUser(e.target.value)}
          placeholder="Enter other user ID"
        />
        <button onClick={initiateCall}>Call</button>
      </div>
    </div>
  );
};

export default VideoChat;
