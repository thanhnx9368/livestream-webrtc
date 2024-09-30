import React, { createContext, useState, useRef, useEffect } from 'react'

export const LivestreamContext = createContext()

export const LivestreamProvider = ({ children }) => {
	const [streaming, setStreaming] = useState(false)
	const videoRef = useRef(null)
	const audioRef = useRef(null)
	const canvasRef = useRef(null)
	const mediaRecorderRef = useRef(null)
	const audioContextRef = useRef(null)
	const analyserRef = useRef(null)
	const dataArrayRef = useRef(null)

	const [stream, setStream] = useState(null)
	const [cameraEnabled, setCameraEnabled] = useState(false)
	const [micEnabled, setMicEnabled] = useState(false)
	const [videoDevices, setVideoDevices] = useState([])
	const [audioDevices, setAudioDevices] = useState([])
	const [selectedVideoDevice, setSelectedVideoDevice] = useState('')
	const [selectedAudioDevice, setSelectedAudioDevice] = useState('')
	const [recordedBlob, setRecordedBlob] = useState(null)

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

	return (
		<LivestreamContext.Provider
			value={{
				streaming,
				setStreaming,
				videoRef,
				audioRef,
				canvasRef,
				mediaRecorderRef,
				audioContextRef,
				analyserRef,
				dataArrayRef,
				stream,
				setStream,
				cameraEnabled,
				micEnabled,
				videoDevices,
				audioDevices,
				selectedVideoDevice,
				setSelectedVideoDevice,
				selectedAudioDevice,
				setSelectedAudioDevice,
				recordedBlob,
				setRecordedBlob,
			}}
		>
			{children}
		</LivestreamContext.Provider>
	)
}
