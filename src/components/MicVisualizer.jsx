// src/components/MicVisualizer.jsx
import React, { useEffect, useRef } from 'react';

const MicVisualizer = ({ selectedAudioDevice }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();

        const updateVisualizer = (stream) => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 2048;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);
                context.fillStyle = 'rgb(200, 200, 200)';
                context.fillRect(0, 0, canvas.width, canvas.height);
                const barWidth = (canvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i];
                    context.fillStyle = 'rgb(50, 50, 50)';
                    context.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
                    x += barWidth + 1;
                }
            };

            draw();
        };

        // Khởi động visualizer nếu có audio device
        if (selectedAudioDevice) {
            navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: selectedAudioDevice } } })
                .then(updateVisualizer)
                .catch(err => console.error('Error accessing audio device:', err));
        }

        return () => {
            audioContext.close();
        };
    }, [selectedAudioDevice]);

    return <canvas ref={canvasRef} width="300" height="100" style={{ border: '1px solid black' }} />;
};

export default MicVisualizer;
