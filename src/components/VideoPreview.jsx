import React, { useEffect } from 'react';

const VideoPreview = ({ videoRef, streaming, recordedBlob, stream }) => {
  useEffect(() => {
    const videoElement = videoRef.current;

    if (stream) {
      videoElement.srcObject = stream;
      videoElement.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    } else {
      videoElement.srcObject = null; // Xóa stream khi không có
    }
  }, [stream]);

  return (
    <div style={{ 
      width: '66.67vw', 
      height: 'calc(66.67vw * 9 / 16)', 
      position: 'relative',
      overflow: 'hidden',
      marginTop: 20 
    }}>
      <video 
        ref={videoRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover' 
        }} 
        autoPlay 
        muted 
      />
      {recordedBlob && (
        <div style={{ marginTop: 20 }}>
          <h3>Replay Livestream</h3>
          <video 
            controls 
            src={recordedBlob} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
