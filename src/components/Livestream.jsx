import React, { useRef, useState, useEffect } from 'react';
import { Button, notification, Select } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const Livestream = () => {
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [recordedBlob, setRecordedBlob] = useState(null);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraEnabled(true);
      } catch {
        setCameraEnabled(false);
      }

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicEnabled(true);
      } catch {
        setMicEnabled(false);
      }
    };

    checkPermissions();

    navigator.mediaDevices.enumerateDevices().then(devices => {
      const video = devices.filter(device => device.kind === 'videoinput');
      const audio = devices.filter(device => device.kind === 'audioinput');
      setVideoDevices(video);
      setAudioDevices(audio);

      if (video.length > 0) setSelectedVideoDevice(video[0].deviceId);
      if (audio.length > 0) setSelectedAudioDevice(audio[0].deviceId);
    });
  }, []);

  const startLivestream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined },
        audio: { deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined },
      });

      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;

      // Ensure to pause before playing
      videoRef.current.pause();
      await videoRef.current.play();

      mediaRecorderRef.current = new MediaRecorder(mediaStream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedBlob(URL.createObjectURL(event.data)); // Save the recorded video blob
        }
      };
      mediaRecorderRef.current.start();

      setupMicVisualizer(mediaStream);

      setStreaming(true); // Update streaming state

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

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const handleDeviceChange = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined },
        audio: { deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined },
      });

      videoRef.current.pause(); // Pause the video before changing the source
      videoRef.current.srcObject = mediaStream; // Update the video source
      await videoRef.current.play(); // Play the video when ready

      setupMicVisualizer(mediaStream);
    } catch (error) {
      notification.error({
        message: 'Device Change Error',
        description: `Unable to access the selected devices: ${error.message}`,
      });
    }
  };

  const setupMicVisualizer = (mediaStream) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(mediaStream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 2048;

    dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    drawMicVisualizer();
  };

  const drawMicVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    const barWidth = (width / dataArrayRef.current.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArrayRef.current.length; i++) {
      barHeight = dataArrayRef.current[i];
      ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
      ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);
      x += barWidth + 1;
    }

    requestAnimationFrame(drawMicVisualizer);
  };

  useEffect(() => {
    handleDeviceChange(); // Connect devices when selected devices change
  }, [selectedVideoDevice, selectedAudioDevice]);

  return (
    <div>
      <h2>Livestream</h2>
      <div style={{ marginBottom: 20 }}>
        <Button type={cameraEnabled ? "primary" : "default"} disabled>
          Camera: {cameraEnabled ? 'Enabled' : 'Not Enabled'}{' '}
          {cameraEnabled && <CheckCircleOutlined />}
        </Button>
        <Button type={micEnabled ? "primary" : "default"} disabled style={{ marginLeft: 10 }}>
          Microphone: {micEnabled ? 'Enabled' : 'Not Enabled'}{' '}
          {micEnabled && <CheckCircleOutlined />}
        </Button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Select
          placeholder="Select Video Device"
          style={{ width: 200 }}
          onChange={(value) => { setSelectedVideoDevice(value); }}
          value={selectedVideoDevice}
        >
          {videoDevices.map(device => (
            <Select.Option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Select Audio Device"
          style={{ width: 200, marginLeft: 10 }}
          onChange={(value) => { setSelectedAudioDevice(value); }}
          value={selectedAudioDevice}
        >
          {audioDevices.map(device => (
            <Select.Option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${device.deviceId}`}
            </Select.Option>
          ))}
        </Select>
        <div style={{ display: 'inline-block', width: 50, height: 50, marginLeft: 10 }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      <Button type="primary" onClick={startLivestream} disabled={streaming}>
        Start Livestream
      </Button>
      {streaming && (
        <Button type="danger" onClick={stopLivestream} disabled={!streaming} style={{ marginLeft: 10 }}>
          Stop Livestream
        </Button>
      )}

      <div style={{ 
        width: '66.67vw', // 2/3 màn hình
        height: 'calc(66.67vw * 9 / 16)', // Tính chiều cao dựa trên tỷ lệ 16:9
        position: 'relative',
        overflow: 'hidden',
        marginTop: 20 
      }}>
        <video 
          ref={videoRef} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' // Giữ tỷ lệ khung hình
          }} 
          autoPlay 
          muted 
        />
      </div>

      {/* Phát lại video livestream */}
      {recordedBlob && (
        <div style={{ marginTop: 20 }}>
          <h3>Replay Livestream</h3>
          <video 
            controls 
            src={recordedBlob} 
            style={{ 
              width: '66.67vw', 
              height: 'calc(66.67vw * 9 / 16)', 
              objectFit: 'cover' 
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default Livestream;
