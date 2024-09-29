import React, { useRef, useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import DeviceSelector from './DeviceSelector';
import VideoPreview from './VideoPreview';
import MicVisualizer from './MicVisualizer';

const Livestream = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [stream, setStream] = useState(null);

  const startLivestream = async (videoDeviceId, audioDeviceId) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined },
        audio: { deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined },
      });

      console.log("Media stream obtained:", mediaStream); // Log trạng thái stream
      setStream(mediaStream);
      mediaRecorderRef.current = new MediaRecorder(mediaStream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedBlob(URL.createObjectURL(event.data));
        }
      };
      mediaRecorderRef.current.start();
      setStreaming(true);
      notification.success({
        message: 'Livestream Started',
        description: 'Livestream and recording have started successfully!',
      });
    } catch (error) {
      notification.error({
        message: 'Livestream Error',
        description: `Unable to start livestream: ${error.message}`,
      });
    }
  };

  const stopLivestream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStreaming(false);
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    notification.info({
      message: 'Livestream Stopped',
      description: 'Livestream and recording have been stopped.',
    });
  };

  return (
    <div>
      <h2>Livestream</h2>
      <DeviceSelector startLivestream={startLivestream} streaming={streaming} />
      <VideoPreview videoRef={videoRef} streaming={streaming} recordedBlob={recordedBlob} stream={stream} />
      <MicVisualizer stream={stream} />
      {streaming && (
        <Button type="danger" onClick={stopLivestream} style={{ marginTop: 20 }}>
          Stop Livestream
        </Button>
      )}
    </div>
  );
};

export default Livestream;
