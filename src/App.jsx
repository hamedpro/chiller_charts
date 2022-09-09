import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./output.css";
import { Compressors } from "./components/Compressors";
import { Compressor } from "./components/Compressor";
import { CommonCharts } from "./components/CommonCharts";
import { useState } from "react";
import "./styles.css";
export default function App() {
	var [tab, set_tab] = useState("compressors");
	return (
		<BrowserRouter>
			<div className="w-full h-full flex flex-row">
				<div className="w-1/4 bg-blue-400 text-white h-full">
					{/* {routes.map((route, index) => {
						return (
							<h1 key={index} className={"/" + route === "" ? "bg-blue-500" : ""}>
								{route}
							</h1>
						);
					})} */}
				</div>
				<div className="w-3/4 bg-white text-black h-full">
					<Routes>
						<Route path="/" element={<Compressors />} />
						<Route path="/compressors" element={<Compressors />} />
						<Route path="/compressors/:compressor_id" element={Compressor} />
						<Route path="/common_charts" element={<CommonCharts />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}
