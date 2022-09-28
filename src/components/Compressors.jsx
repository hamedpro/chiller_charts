import React, { useEffect, useState } from "react";
import { custom_ajax } from "../custom_ajax";

function ChartView({type,compressor_index=undefined}) {
	var [data, set_data] = useState(null)
	var [filters, set_filters] = useState({
	})
	var [charts,set_charts] = useState([])
	function build_chart_data() {
		var chart_data;
		if (type === "common") {
			chart_data = {
				labels: data.logs.map(log => new Date(log.date).toUTCString()),
				datasets: Object.keys(data.logs[0].common).map(common_data_field_name => {
					return {
						label: common_data_field_name,
						data: data.logs.map(log => {
							return log.common.data[common_data_field_name]
						}),
						backgroundColor: "rgba(255, 99, 132, 0.2)",
						borderColor: "rgba(66, 40, 181, 0.8)",
						borderWidth: 1,
					}
				})
			}
		} else if (type === "compressor") {
			var field_names = Object.keys(data.logs[0].compressors[0]);
			chart_data= {
				labels: data.logs.map(log=>new Date(log.date).toUTCString()),
				datasets: Object.keys(data.logs[0].compressors[compressor_index].data).map(compressor_data_field_name => {
					return ({
							label: compressor_data_field_name,
						data: data.logs.map(log => {
								return log.compressors[compressor_index].data[compressor_data_field_name]
						}),
						backgroundColor: "rgba(255, 99, 132, 0.2)",
						borderColor: "rgba(66, 40, 181, 0.8)",
						borderWidth: 1,
					})
				}),
			}
		}
		console.log(chart_data)
		//filtering the data depending on "filters" state

		return chart_data
	}
	async function init_or_update_chart() {
		if(data === null) return 
		if (!charts[0]) {
			var ctx = document.getElementById("common_chart"+compressor_index).getContext("2d");
			charts[0] = new Chart(ctx, {
				type: "line",
				data: build_chart_data(),
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		} else {
			//todo just update changed parts
			charts[0].data = build_chart_data(),
			charts[0].update()
		}
		
	}
	function fetch_data() {
		custom_ajax({
			route : "/"
		}).then(data => {
			set_data(data)
		}, err => {
			alert('something went wrong when fetching data from server')
			console.log(err)
		})
	}
	useEffect(() => {
		init_or_update_chart()
	}, [data,filters])

	useEffect(() => {
		fetch_data()
	}, [])
	
	//todo register an interval to update the chart every for ex 2 secs using this line below: 
	//setInterval(init_or_update_chart,2000)
	return (
		<div className="border border-blue-400 m-2 p-2">
			<h1>compressor #{compressor_index }</h1>
			<canvas id={"common_chart"+compressor_index}></canvas>
			<button onClick={fetch_data}
			className="px-1 pt-1 border border-blue-400 rounded mx-2"
			>update now</button>
		</div>
	);
}
export function Compressors() {
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
				<ChartView type="common"/>
			) && data.logs[0].compressors.map((compressor, index) => {
				return (
					<React.Fragment key={index}>
						<ChartView type="compressor" compressor_index={index}/>
					</React.Fragment>
					
				)
			})}
			
		</>
		
	)
}
