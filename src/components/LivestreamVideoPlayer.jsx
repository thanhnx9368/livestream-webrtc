import React, { useContext, forwardRef } from 'react'
import { LivestreamContext } from '../context/LivestreamContext'

const LivestreamVideoPlayer = forwardRef((props, ref) => {
	const { recordedBlob } = useContext(LivestreamContext)

	return (
		<div style={{ marginTop: 20 }}>
			<div
				style={{
					width: '66.67vw',
					height: 'calc(66.67vw * 9 / 16)',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<video
					ref={ref}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
					autoPlay
					muted
				/>
			</div>

			{recordedBlob && (
				<div style={{ marginTop: 20 }}>
					<h3>Replay Livestream</h3>
					<video
						controls
						src={recordedBlob}
						style={{
							width: '66.67vw',
							height: 'calc(66.67vw * 9 / 16)',
							objectFit: 'cover',
						}}
					/>
				</div>
			)}
		</div>
	)
})

export default LivestreamVideoPlayer
