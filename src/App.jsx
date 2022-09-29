import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./output.css";
import "./styles.css";
import { SideBar } from "./components/SideBar";
import { Settings } from "./components/settings";
import { ChartsComponent } from "./components/Charts";
export default function App() {
	return (
		<BrowserRouter>
			<div className="w-full h-full flex flex-row">
				<div className="w-1/4 bg-blue-400 text-white h-full">
					<SideBar />	
				</div>
				
				<div className="w-3/4 bg-white text-black h-full overflow-y-auto">
					<Routes>
						<Route path="/" element={<ChartsComponent />} />
						<Route path="/charts" element={<ChartsComponent />} />
						<Route path="/settings" element={<Settings />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}
