import React, { useEffect, useState } from 'react'
import { Select, Button, notification } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const DeviceSelector = ({ startLivestream, streaming }) => {
	const [cameraEnabled, setCameraEnabled] = useState(false)
	const [micEnabled, setMicEnabled] = useState(false)
	const [videoDevices, setVideoDevices] = useState([])
	const [audioDevices, setAudioDevices] = useState([])
	const [selectedVideoDevice, setSelectedVideoDevice] = useState('')
	const [selectedAudioDevice, setSelectedAudioDevice] = useState('')

	useEffect(() => {
		const checkPermissions = async () => {
			try {
				await navigator.mediaDevices.getUserMedia({ video: true })
				setCameraEnabled(true)
			} catch {
				setCameraEnabled(false)
			}

			try {
				await navigator.mediaDevices.getUserMedia({ audio: true })
				setMicEnabled(true)
			} catch {
				setMicEnabled(false)
			}
		}

		checkPermissions()

		navigator.mediaDevices.enumerateDevices().then((devices) => {
			const video = devices.filter((device) => device.kind === 'videoinput')
			const audio = devices.filter((device) => device.kind === 'audioinput')
			setVideoDevices(video)
			setAudioDevices(audio)

			if (video.length > 0) setSelectedVideoDevice(video[0].deviceId)
			if (audio.length > 0) setSelectedAudioDevice(audio[0].deviceId)
		})
	}, [])

	const handleStartLivestream = () => {
		if (selectedVideoDevice && selectedAudioDevice) {
			startLivestream(selectedVideoDevice, selectedAudioDevice)
		} else {
			notification.error({
				message: 'Device Error',
				description: 'Please select both video and audio devices.',
			})
		}
	}

	return (
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

			<Select
				placeholder="Select Video Device"
				style={{ width: 200, marginTop: 10 }}
				onChange={(value) => setSelectedVideoDevice(value)}
				value={selectedVideoDevice}
				disabled={streaming}
			>
				{videoDevices.map((device) => (
					<Select.Option key={device.deviceId} value={device.deviceId}>
						{device.label || `Camera ${device.deviceId}`}
					</Select.Option>
				))}
			</Select>
			<Select
				placeholder="Select Audio Device"
				style={{ width: 200, marginLeft: 10, marginTop: 10 }}
				onChange={(value) => setSelectedAudioDevice(value)}
				value={selectedAudioDevice}
				disabled={streaming}
			>
				{audioDevices.map((device) => (
					<Select.Option key={device.deviceId} value={device.deviceId}>
						{device.label || `Microphone ${device.deviceId}`}
					</Select.Option>
				))}
			</Select>

			<Button
				type="primary"
				onClick={handleStartLivestream}
				style={{ marginLeft: 10 }}
				disabled={streaming}
			>
				Start Livestream
			</Button>
		</div>
	)
}

export default DeviceSelector
