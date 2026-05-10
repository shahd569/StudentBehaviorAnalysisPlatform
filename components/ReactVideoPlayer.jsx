"use client";

import dynamic from "next/dynamic";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const ReactVideoPlayer = forwardRef(
  (
    { url, onPlay, onPause, onRateChange, playbackRate, onReady, onProgress },
    ref,
  ) => {
    const internalRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => currentTime,
      getDuration: () => duration,
      seekTo: (time) => internalRef.current?.seekTo(time),
    }));

    const handleProgress = (progress) => {
      setCurrentTime(progress.playedSeconds);
      if (onProgress) onProgress(progress);
    };

    const handleDuration = (dur) => {
      setDuration(dur);
    };

    return (
      <ReactPlayer
        ref={internalRef}
        url={url}
        controls={true}
        width="100%"
        height="auto"
        playbackRate={playbackRate || 1}
        onPlay={onPlay}
        onPause={onPause}
        onPlaybackRateChange={onRateChange}
        onReady={onReady}
        onProgress={handleProgress}
        onDuration={handleDuration}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
            },
          },
        }}
      />
    );
  },
);

ReactVideoPlayer.displayName = "ReactVideoPlayer";

export default ReactVideoPlayer;
