import React, { useEffect, useRef } from 'react'
import Hls from 'hls.js'

const LiveStreamPlayer = ({ streamUrl }) => {
	const videoRef = useRef(null)

	// Khởi tạo HLS.js để phát stream
	useEffect(() => {
		if (Hls.isSupported() && videoRef.current) {
			const hls = new Hls()
			hls.loadSource(streamUrl)
			hls.attachMedia(videoRef.current)
		}
	}, [streamUrl])

	return (
		<video ref={videoRef} controls style={{ width: '100%', marginTop: 20 }} />
	)
}

export default LiveStreamPlayer
