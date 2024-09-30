import React, { useContext } from 'react'
import { Select } from 'antd'
import { LivestreamContext } from '../context/LivestreamContext'

const LivestreamDeviceSelector = () => {
	const {
		videoDevices,
		audioDevices,
		selectedVideoDevice,
		setSelectedVideoDevice,
		selectedAudioDevice,
		setSelectedAudioDevice,
	} = useContext(LivestreamContext)

	return (
		<div style={{ marginBottom: 20 }}>
			<Select
				placeholder="Select Video Device"
				style={{ width: 200 }}
				onChange={(value) => {
					setSelectedVideoDevice(value)
				}}
				value={selectedVideoDevice}
			>
				{videoDevices.map((device) => (
					<Select.Option key={device.deviceId} value={device.deviceId}>
						{device.label || `Camera ${device.deviceId}`}
					</Select.Option>
				))}
			</Select>
			<Select
				placeholder="Select Audio Device"
				style={{ width: 200, marginLeft: 10 }}
				onChange={(value) => {
					setSelectedAudioDevice(value)
				}}
				value={selectedAudioDevice}
			>
				{audioDevices.map((device) => (
					<Select.Option key={device.deviceId} value={device.deviceId}>
						{device.label || `Microphone ${device.deviceId}`}
					</Select.Option>
				))}
			</Select>
		</div>
	)
}

export default LivestreamDeviceSelector
