import { CheckBox, CheckBoxOutlineBlankOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { custom_ajax } from "../custom_ajax";
import { ChartView } from "./ChartView";

export function ChartsComponent() {
	var [data, set_data] = useState(null);
	function fetch_data() {
		custom_ajax({
			route: "/",
		}).then(
			(data) => {
				set_data(data);
			},
			(err) => {
				alert("something went wrong");
				console.log(err);
			}
		);
	}
	useEffect(fetch_data, []);
	return (
		<>
			{data === null && <h1>loading the data ...</h1>}
			{data !== null && (
				<>
					{data.settings.layout === "1col" && (
						<>
							<ChartView type="common" />
							{data.logs[0].compressors.map((compressor, index) => {
								return (
									<React.Fragment key={index}>
										<ChartView type="compressor" compressor_index={index}/>
									</React.Fragment>
								);
							})}
						</>
					)}
					{data.settings.layout === "2col" && (
						<div className="flex w-full mb-4">
							<div className="w-1/2 mb-2">
								<ChartView type="common" className="h-1/2"/>
								{data.logs[0].compressors
									.map((compressor,original_index) => ({...compressor,original_index}))
									.filter((item, index) => {
										if (item.original_index % 2 !== 0) {
											return true;
										}
									})
									.map((compressor, index) => {
										return (
											<React.Fragment key={index}>
												<ChartView
													type="compressor"
													compressor_index={compressor.original_index}
													className="h-1/2"
												/>
											</React.Fragment>
										);
									})}
							</div>
							<div className="w-1/2 mb-2">
								{data.logs[0].compressors
									.map((compressor,original_index) => ({...compressor,original_index}))
									.filter((item, index) => {
										if (item.original_index % 2 === 0) {
											return true;
										}
									})
									/* .map((item,index) => {
										console.log(`item with index ${index} is going to be shown in 2nd col`)
										return item
									}) */
									.map((compressor, index) => {
										return (
											<React.Fragment key={index}>
												<ChartView
													type="compressor"
													compressor_index={compressor.original_index}
													className="h-1/2"
												/>
											</React.Fragment>
										);
									})}
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}
