import { CheckBox, CheckBoxOutlineBlankOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { custom_ajax } from "../custom_ajax";
import { ChartView } from "./ChartView";

export function ChartsComponent() {
	var [data, set_data] = useState(null)
	function fetch_data() {
		custom_ajax({
			route : '/'
		}).then(data => {
			set_data(data)
		}, err => {
			alert('something went wrong')
			console.log(err)
		})
	}
	useEffect(fetch_data,[])
	return (
		<>
			{data === null && (
				<h1>loading the data ...</h1>
			)}
			{data !== null && (
				<>
					<ChartView type="common" />
					{data.logs[0].compressors.map((compressor, index) => {
						return (
							<React.Fragment key={index}>
								<ChartView type="compressor" compressor_index={index}/>
							</React.Fragment>
						)
					})}
				</>
			)}
			
		</>
		
	)
}
