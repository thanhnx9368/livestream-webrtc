import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
// import Livestream from './Livestream'
import Livestream from './components/Livestream'
import { LivestreamProvider } from './context/LivestreamContext'

const { Header, Content } = Layout

const App = () => {
	// Các mục menu
	const menuItems = [
		{ label: 'Home', key: '1' },
		{ label: 'Recorder', key: '2' },
		{ label: 'Player', key: '3' },
		{ label: 'Livestream', key: '4' },
	]

	return (
		<LivestreamProvider>
			<Layout className="layout">
				<Header>
					<div className="logo">Livestream App</div>
					{/* Menu điều hướng */}
					<Menu
						theme="dark"
						mode="horizontal"
						defaultSelectedKeys={['1']}
						items={menuItems}
					/>
				</Header>
				<Content style={{ padding: '50px' }}>
					<div className="site-layout-content">
						<Livestream />
					</div>
				</Content>
			</Layout>
		</LivestreamProvider>
	)
}

export default App
