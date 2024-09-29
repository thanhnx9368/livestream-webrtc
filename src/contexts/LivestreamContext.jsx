// src/contexts/LivestreamContext.jsx
import React, { createContext, useState } from 'react';

export const LivestreamContext = createContext();

export const LivestreamProvider = ({ children }) => {
    const [streaming, setStreaming] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [stream, setStream] = useState(null);

    const startLivestream = async (videoDeviceId, audioDeviceId) => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined },
                audio: { deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined },
            });
            setStream(mediaStream);
            setStreaming(true);
        } catch (error) {
            console.error('Error starting livestream:', error);
        }
    };

    const stopLivestream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setStreaming(false);
    };

    return (
        <LivestreamContext.Provider value={{ streaming, recordedBlob, stream, startLivestream, stopLivestream }}>
            {children}
        </LivestreamContext.Provider>
    );
};
