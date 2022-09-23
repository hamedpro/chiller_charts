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
	useEffect(fetch_data,[])
	return (
		<>
			{compressors_data === null && (
				<h1>data of compressors is being loaded</h1>
			)}
			{compressors_data !== null && (
				<h1>{ JSON.stringify(compressors_data)}</h1>
			)}
		</>
	);
}
