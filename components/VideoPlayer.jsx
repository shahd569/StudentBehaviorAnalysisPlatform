"use client";
import dynamic from "next/dynamic";
import "video.js/dist/video-js.css";

const VideoPlayer = dynamic(() => import("next-react-videojs"), { ssr: false });

export default VideoPlayer;
