import React, { useContext } from 'react'
import { Button, notification } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import {
	LivestreamProvider,
	LivestreamContext,
} from './context/LivestreamContext'
import LivestreamDeviceSelector from './components/LivestreamDeviceSelector'
import LivestreamVideoPlayer from './components/LivestreamVideoPlayer'

const Livestream = () => {
	const {
		streaming,
		setStreaming,
		videoRef,
		mediaRecorderRef,
		setStream,
		cameraEnabled,
		micEnabled,
		selectedVideoDevice,
		selectedAudioDevice,
		setRecordedBlob,
		audioContextRef,
	} = useContext(LivestreamContext)

	const startLivestream = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					deviceId: selectedVideoDevice
						? { exact: selectedVideoDevice }
						: undefined,
				},
				audio: {
					deviceId: selectedAudioDevice
						? { exact: selectedAudioDevice }
						: undefined,
				},
			})

			setTimeout(() => {
				console.log(videoRef.current, 'videoRef.current')
				if (videoRef.current) {
					videoRef.current.srcObject = mediaStream
					videoRef.current.pause()
					videoRef.current.play().catch((error) => {
						console.error('Error while playing video:', error)
					})
				}
			}, 500)

			mediaRecorderRef.current = new MediaRecorder(mediaStream)
			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) {
					setRecordedBlob(URL.createObjectURL(event.data))
				}
			}
			mediaRecorderRef.current.start()

			setStreaming(true)

			notification.success({
				message: 'Livestream Started',
				description: 'Livestream and recording have started successfully!',
			})
		} catch (error) {
			notification.error({
				message: 'Livestream Error',
				description: `Unable to start livestream: ${error.message}`,
			})
		}
	}

	const stopLivestream = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop()
		}
		setStreaming(false)
		notification.info({
			message: 'Livestream Stopped',
			description: 'Livestream and recording have been stopped.',
		})
		if (audioContextRef.current) {
			audioContextRef.current.close()
		}
	}

	return (
		<LivestreamProvider>
			<div>
				<h2>Livestream</h2>
				<div style={{ marginBottom: 20 }}>
					<Button type={cameraEnabled ? 'primary' : 'default'} disabled>
						Camera: {cameraEnabled ? 'Enabled' : 'Not Enabled'}{' '}
						{cameraEnabled && <CheckCircleOutlined />}
					</Button>
					<Button
						type={micEnabled ? 'primary' : 'default'}
						disabled
						style={{ marginLeft: 10 }}
					>
						Microphone: {micEnabled ? 'Enabled' : 'Not Enabled'}{' '}
						{micEnabled && <CheckCircleOutlined />}
					</Button>
				</div>

				<LivestreamDeviceSelector />

				<Button type="primary" onClick={startLivestream} disabled={streaming}>
					Start Livestream
				</Button>
				{streaming && (
					<Button
						type="danger"
						onClick={stopLivestream}
						style={{ marginLeft: 10 }}
					>
						Stop Livestream
					</Button>
				)}

				<LivestreamVideoPlayer />
			</div>
		</LivestreamProvider>
	)
}

export default Livestream
