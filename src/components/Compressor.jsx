import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function Compressor() {
	var compressor_id = useParams().compressor_id;
	return <div id="chart"></div>;
}
