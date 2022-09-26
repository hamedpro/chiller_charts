import { useState } from "react";
import { useEffect } from "react";
import { custom_ajax } from "../custom_ajax";

export function Compressors() {
	var [compressors_data, set_compressors_data] = useState(null)
	function fetch_data() {
		custom_ajax({
			route : `/compressors`
		}).then(data => {
			set_compressors_data(data)
		}, error => {
			alert('something went wrong')
			console.log(error)
		})	
	}
	useEffect(fetch_data, [])
	function render_fake_chart() {
		if(compressors_data === null ) return 
		var ctx = document.getElementById('common_chart').getContext('2d')
		/* console.log(compressors_data.lines[0])  */
		var field_names = Object.keys(compressors_data.lines[0].data)
		const myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels:field_names,
				datasets: [{
					label: '# of Votes',
					data: field_names.map(field_name=>compressors_data.lines[0].data[field_name]),
					backgroundColor:'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
	}
	useEffect(render_fake_chart,[compressors_data])
	return (
		<>
			<canvas id="common_chart"></canvas>
			{compressors_data === null && (
				<h1>data of compressors is being loaded</h1>
			)}
			{compressors_data !== null && (
				<>
				<h1></h1>
				</>
			)}
			
		</>
	);
}
