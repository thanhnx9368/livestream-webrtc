import React from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { Button } from 'antd';

const Recorder = () => {
  return (
    <ReactMediaRecorder
      video
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div>
          {/* Trạng thái ghi âm */}
          <p>Status: {status}</p>
          {/* Nút bắt đầu ghi */}
          <Button type="primary" onClick={startRecording}>
            Start Recording
          </Button>
          {/* Nút dừng ghi */}
          <Button type="danger" onClick={stopRecording}>
            Stop Recording
          </Button>
          {/* Video xem trước */}
          <video src={mediaBlobUrl} controls autoPlay loop style={{ marginTop: 20 }} />
        </div>
      )}
    />
  );
};

export default Recorder;
