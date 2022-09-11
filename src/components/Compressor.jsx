import { useCallback } from "react";
import { useParams } from "react-router-dom";

export function Compressor() {
	useCallback(() => {}, []);
	var compressor_id = useParams().compressor_id;
	return <div id="chart"></div>;
}
