import { useParams } from "react-router-dom";

export function Compressor() {
	var compressor_id = useParams().compressor_id;
	return <h1>compressor {compressor_id}</h1>;
}
