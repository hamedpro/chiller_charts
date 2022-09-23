import { useEffect } from "react";
import { useState } from "react";
import { custom_ajax } from "../custom_ajax";

export function CommonCharts() {
	var [common_data, set_common_data] = useState(null)
	function fetch_data() {
		custom_ajax({
			route : "/common"
		}).then(data => {
			set_common_data(data)
		}, error => {
			alert('something went wrong while fetching data from server')
			console.log(error )
		})
	}
	useEffect(fetch_data,[])
	return (
		<>
			{common_data === null && (
				<h1>common data is being loaded</h1>
			)}
			{common_data !== null && (
				<h1>{ JSON.stringify(common_data)}</h1>
			)}
		</>
	);
}
