import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { custom_ajax } from "../custom_ajax";

export function Compressor() {
	var compressor_id = useParams().compressor_id;
	var [compressor_data, set_compressor_data] = useState(null)
	function fetch_data() {
		custom_ajax({
			route : `/compressors/${compressor_id}`
		}).then(data => {
			set_compressor_data(data)
		}, error => {
			alert('something went wrong')
			console.log(error)
		})	
	}
	useEffect(fetch_data,[])
	return (
		<>
			{compressor_data === null && (
				<h1>compressor {compressor_id} : data is being loaded</h1>
			)}
			{compressor_data !== null && (
				<h1>{ JSON.stringify(compressor_data)}</h1>
			)}
		</>
	);
}
