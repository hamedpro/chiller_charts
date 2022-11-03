import { CheckBox, CheckBoxOutlineBlankOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { custom_ajax } from "../custom_ajax";
var cloned_filters = null /* 
	becuse of lexical scope and that we are using this filters 
	inside a function chain inside a setInterval we should use this trick to 
	define it out here first 
	more info : https://stackoverflow.com/questions/1047454/what-is-lexical-scope
*/
export function ChartView({ type, compressor_index = undefined }) {
	var [filters, set_filters] = useState({});
	cloned_filters = filters
	var [data, set_data] = useState(null);
	var [alert_statuses, set_alert_statuses] = useState({
		loading: false,
		filtered_logs_length_zero: false,
		fetch_error: false,
	});
	function build_chart_data(data_prop) {
		/* console.log(data_prop) */
		if (data_prop === null || data_prop.logs.length === 0) {
			return null;
		}

		var filtered_data = { ...data_prop };
		if (compressor_index === undefined) {
			console.group()
		}
		
		if (compressor_index === undefined) {
			console.log('going to check if there is any filter or not', cloned_filters)
		}
		if (Object.keys(cloned_filters).length !== 0) {
			if (cloned_filters["from"]) {
				filtered_data.logs = filtered_data.logs.filter((log) => {
					var from_time = new Date().getTime() - cloned_filters["from"] * 1000;
					var log_time = log.date;
					/* console.log(
						`there is a from filter :‍‍‍‍ filter accepts logs with date bigger or equal to ${from_time} : log time is ${log_time} : log date - filter date = ${
							log_time - from_time
						} so this log is ${log_time >= from_time ? "accepted" : "rejected"}`
					); */
					return log_time >= from_time;
				});
			}
			if (cloned_filters["to"]) {
				filtered_data.logs = filtered_data.logs.filter((log) => {
					return Number(log.date) <= cloned_filters["to"];
				});
			}
		}
		if (compressor_index === undefined) {
			console.log(filtered_data)
		}
		if (compressor_index === undefined) {
			console.groupEnd()
		}
		if (filtered_data.logs.length === 0) return null;
		if (type === "common") {
			return {
				labels: filtered_data.logs.map((log) => new Date(log.date).toUTCString()),
				datasets: Object.keys(filtered_data.logs[0].common.data).map(
					(common_data_field_name) => {
						return {
							label: common_data_field_name,
							data: data_prop.logs.map((log) => {
								return log.common.data[common_data_field_name];
							}),
							backgroundColor: "rgba(255, 99, 132, 0.2)",
							borderColor: "rgba(66, 40, 181, 0.8)",
							borderWidth: 1,
						};
					}
				),
			};
		} else if (type === "compressor") {
			var field_names = Object.keys(filtered_data.logs[0].compressors[0]);
			return {
				labels: filtered_data.logs.map((log) => new Date(log.date).toUTCString()),
				datasets: Object.keys(filtered_data.logs[0].compressors[compressor_index].data).map(
					(compressor_data_field_name) => {
						return {
							label: compressor_data_field_name,
							data: filtered_data.logs.map((log) => {
								return log.compressors[compressor_index].data[
									compressor_data_field_name
								];
							}),
							backgroundColor: "rgba(255, 99, 132, 0.2)",
							borderColor: "rgba(66, 40, 181, 0.8)",
							borderWidth: 1,
						};
					}
				),
			};
		}
	}
	async function update_chart() {
		/* if (compressor_index === undefined) {
			console.log(Object.keys(filters).length);
		} */
		set_alert_statuses((prev_state) => {
			return {
				loading: true,
				filtered_logs_length_zero: false,
				fetch_error: false,
			}; //todo take care about alerts system and also about that set_state is async
		});
		try {
			var fetched_data = await custom_ajax({
				route: "/",
			});
			set_data(fetched_data);
		} catch (error) {
			set_alert_statuses((prev_state) => {
				return {
					...prev_state, //todo make sure this kind of duplicating object and overriding a prop works well in all situations
					fetch_error: true,
				};
			});
			/* if (compressor_index === undefined) {
				in the time of writing what is put here will only execute for the first component 
					becuse it doesnt belong to a compressor and it shows the common data instead
				
			} */
			return;
		}

		if (window.charts[compressor_index] === undefined) {
			var ctx = document.getElementById("common_chart" + compressor_index).getContext("2d");
			window.charts[compressor_index] = new Chart(ctx, {
				type: "line",
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		}

		var chart_data = build_chart_data(fetched_data);
		/* if (Object.keys(filters).length !== 0 && chart_data !== null) {
			console.log('error ')
		} */
		/* console.log({
			chart_data
		}) */
		if (chart_data === null) {
			window.charts[compressor_index].data = undefined;
			window.charts[compressor_index].update();
			//show a banner saying there is not any logs to show
			set_alert_statuses((prev_state) => {
				return {
					...prev_state,
					filtered_logs_length_zero: true,
				};
			});
		} else {
			/* if (compressor_index === undefined) {
				console.log(Object.keys(filters).length );
			} */
			window.charts[compressor_index].data = chart_data;
			window.charts[compressor_index].update();
		}
		set_alert_statuses((prev_state) => {
			return {
				...prev_state,
				loading: false,
			};
		});
	}

	useEffect(() => {
		update_chart();
	}, [filters]);
	var [intervals, set_intervals] = useState([]);
	useEffect(() => {
		if (window.charts === undefined) {
			window.charts = {};
		}
		if (window.charts[compressor_index] !== undefined) {
			window.charts[compressor_index].destroy();
			delete window.charts[compressor_index];
		}
		var tmp = async () => {
			var fetch_result = await custom_ajax({
				route: "/",
			});
			set_intervals((prev_intervals) => {
				return [
					...prev_intervals,
					setInterval(update_chart, fetch_result.settings.update_cycle_duration * 1000),
				];
			});
		};
		tmp();
	}, []);
	useEffect(() => {
		return () => {
			//clearing intervals
			for (let i = 0; i < intervals.length; i++) {
				clearInterval(intervals[i]);
			}
		};
	}, []);
	/* useEffect(() => {
		
	}, [filters]); */
	return (
		<div className="border border-blue-400 m-2 p-2">
			<div>
				<p
					className={[
						"text-red-500",
						alert_statuses["loading"] ? "block" : "hidden",
					].join(" ")}
				>
					data is being loaded
				</p>
				<p
					className={[
						"text-red-500",
						alert_statuses["filtered_logs_length_zero"] ? "block" : "hidden",
					].join(" ")}
				>
					data is loaded but there is not any logs to show considering your filters
				</p>
				<p
					className={[
						"text-red-500",
						alert_statuses["fetch_error"] ? "block" : "hidden",
					].join(" ")}
				>
					something went wrong when trying to fetch data from server
				</p>
			</div>
			<h1>
				{(type === "common" && "common data") ||
					(type === "compressor" && `compressor #${compressor_index}`)}
			</h1>
			<canvas id={"common_chart" + compressor_index}></canvas>
			<button
				onClick={update_chart}
				className="px-1 pt-1 border border-blue-400 rounded mx-2 mt-3"
			>
				update now
			</button>

			<div className="border border-red-400 rounded mt-2 p-2">
				<h1>show logs of "x" seconds age :</h1>
				<div className="flex space-x-1 flex-row flex-wrap">
					{[20, 60, 120, 180, 300, 600].map((number) => {
						return (
							<p
								key={number}
								onClick={() => {
									set_filters((old_filters) => ({
										...old_filters,
										from: number,
									}));
								}}
								className="inline border-blue-400 border rounded-lg h-fit mt-1 px-1 hover:bg-blue-600 hover:text-white cursor-pointer duration-300"
							>
								{filters["from"] === number ? (
									<CheckBox />
								) : (
									<CheckBoxOutlineBlankOutlined />
								)}
								{number} seconds
							</p>
						);
					})}
				</div>
				<span className="mt-2">or enter a duration manually (in seconds) :</span>{" "}
				<input
					onChange={(event) => {
						var time_limit = event.target.value;
						set_filters((old_filters) => ({
							...old_filters,
							from: time_limit,
						}));
					}}
					className="px-2 border border-blue-400 rounded my-1"
				/>
			</div>
			{type === "common" && (
				<>
					<h1 className="text-lg mt-2">errors :</h1>
					{data === null && <h1>loading ...</h1>}
					{data !== null &&
						data.logs.map((log, log_index) => {
							return (
								<p key={log_index}>{`errors of log at "${new Date(
									log.date
								).toUTCString()}" : ${JSON.stringify(log.common.errors)}`}</p>
							);
						})}
				</>
			)}
		</div>
	);
}
