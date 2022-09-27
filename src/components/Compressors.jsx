import { useEffect, useState } from "react";
import { custom_ajax } from "../custom_ajax";

export function Compressors() {
	var [data, set_data] = useState(null)
	var [filters, set_filters] = useState({
		hidden_fields: [] // array of string || "all"
	})
	var [charts,set_charts] = useState([])
	function build_chart_data() {
		var field_names = Object.keys(data.logs[0].compressors[0]);
		var filtered_data
		var chart_data = {
			labels: field_names,
			datasets: [
				{
					label: "# of Votes",
					data: field_names.map(
						(field_name) => data.logs[0].compressors[0][field_name]
					),
					backgroundColor: "rgba(255, 99, 132, 0.2)",
					borderColor: "rgba(255, 99, 132, 1)",
					borderWidth: 1,
				},
			],
		}

		//filtering the data depending on "filters" state
		
		for (let i = 0; i < filters.hidden_fields.length; i++){
			
		}

		return chart_data
	}
	async function init_or_update_chart() {
		if(data === null) return 
		if (!charts[0]) {
			var ctx = document.getElementById("common_chart").getContext("2d");
			charts[0] = new Chart(ctx, {
				type: "line",
				data :build_chart_data(),
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		} else {
			console.log('chart was falsy so the chart is going to be updated')
			charts[0].data = build_chart_data()
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

	/* useEffect(() => {
		fetch_data()
		setInterval(fetch_data,5000)
	}, []) */
	
	//todo register an interval to update the chart every for ex 2 secs using this line below: 
	//setInterval(init_or_update_chart,2000)
	return (
		<>
			<canvas id="common_chart"></canvas>
		</>
	);
}
