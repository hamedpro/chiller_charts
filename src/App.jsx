import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./output.css";
import { Compressors } from "./components/Compressors";
import { CommonCharts } from "./components/CommonCharts";
import { useState } from "react";
import "./styles.css";
import { useEffect } from "react";
import { SideBar } from "./components/SideBar";
import { Settings } from "./components/settings";
export default function App() {
	return (
		<BrowserRouter>
			<div className="w-full h-full flex flex-row">
				<div className="w-1/4 bg-blue-400 text-white h-full">
					<SideBar />	
				</div>
				
				<div className="w-3/4 bg-white text-black h-full">
					<Routes>
						<Route path="/" element={<Compressors />} />
						<Route path="/compressors" element={<Compressors />} />
						<Route path="/common" element={<CommonCharts />} />
						<Route path="/settings" element={<Settings />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}
