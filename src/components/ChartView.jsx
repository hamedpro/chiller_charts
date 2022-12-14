import { CheckBox, CheckBoxOutlineBlankOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Section } from "../common_components/Section";
import { custom_ajax } from "../custom_ajax";
var debug_mode = false; //if true there will be some more console.logs and ... in order to make debugging easier
export function ChartView({ type, compressor_index = undefined, className = "" }) {
	var cloned_filters_window_var = "rand_rwerwe"+ compressor_index
	/* 
		becuse of lexical scope and that we are using this filters 
		inside a function chain inside a setInterval we should use this trick to 
		define it out here first 
		more info : https://stackoverflow.com/questions/1047454/what-is-lexical-scope
	*/
	if (window[cloned_filters_window_var] === undefined) {
		window[cloned_filters_window_var] = null
	}
	//console.log(compressor_index)
	var [filters, set_filters] = useState({});
	window[cloned_filters_window_var] = filters
	var [data, set_data] = useState(null);
	var [alert_statuses, set_alert_statuses] = useState({
		filtered_logs_length_zero: false,
		fetch_error: false,
	});
	function build_chart_data(data_prop) {
		/* console.log(data_prop) */
		if (data_prop === null || data_prop.logs.length === 0) {
			return null;
		}

		var filtered_data = { ...data_prop };
		if (compressor_index === undefined && debug_mode) {
			console.group();
		}

		if (compressor_index === undefined && debug_mode) {
			console.log("going to check if there is any filter or not", window[cloned_filters_window_var]);
		}
		if (Object.keys(window[cloned_filters_window_var]).length !== 0) {
			if (window[cloned_filters_window_var]["from"]) {
				filtered_data.logs = filtered_data.logs.filter((log) => {
					var from_time = new Date().getTime() - window[cloned_filters_window_var]["from"] * 1000;
					var log_time = log.date;
					/* console.log(
						`there is a from filter :‍‍‍‍ filter accepts logs with date bigger or equal to ${from_time} : log time is ${log_time} : log date - filter date = ${
							log_time - from_time
						} so this log is ${log_time >= from_time ? "accepted" : "rejected"}`
					); */
					return log_time >= from_time;
				});
			}
			if (window[cloned_filters_window_var]["to"]) {
				filtered_data.logs = filtered_data.logs.filter((log) => {
					return Number(log.date) <= window[cloned_filters_window_var]["to"];
				});
			}
		}
		if (compressor_index === undefined && debug_mode) {
			console.log(filtered_data);
		}
		if (compressor_index === undefined && debug_mode) {
			console.groupEnd();
		}
		if (filtered_data.logs.length === 0) return null;
		if (type === "common") {
			return {
				labels: filtered_data.logs.map((log) => new Date(log.date).toUTCString()),
				datasets: Object.keys(filtered_data.logs[0].common.data).map(
					(common_data_field_name) => {
						return {
							label: common_data_field_name,
							data: filtered_data.logs.map(
								(log) => log.common.data[common_data_field_name]
							),
							backgroundColor: "rgba(255, 99, 132, 0.2)",
							borderColor: "rgba(66, 40, 181, 0.8)",
							borderWidth: 1,
							segment: {
								borderColor: (ctx) => {
									return Object.keys(
										filtered_data.logs[ctx.p1DataIndex].common.errors
									).length === 0
										? undefined
										: "rgb(255,0,0)";
								},
							},
							spanGaps: true,
						};
					}
				),
			};
			/* todo : show error if you are using object.keys of 
			for ex filtered_data.logs[0].common.data and 
			you expect the others to be like that and they're not 
			*/
		} else if (type === "compressor") {
			var field_names = Object.keys(filtered_data.logs[0].compressors[0]);
			return {
				labels: filtered_data.logs.map((log) => new Date(log.date).toUTCString()),
				datasets: Object.keys(filtered_data.logs[0].compressors[compressor_index].data).map(
					(compressor_data_field_name) => {
						return {
							label: compressor_data_field_name,
							data: filtered_data.logs.map(
								(log) =>
									log.compressors[compressor_index].data[
										compressor_data_field_name
									]
							),
							backgroundColor: "rgba(255, 99, 132, 0.2)",
							borderColor: "rgba(66, 40, 181, 0.8)",
							borderWidth: 1,
							segment: {
								borderColor: (ctx) => {
									return Object.keys(
										filtered_data.logs[ctx.p1DataIndex].common.errors
									).length === 0
										? undefined
										: "rgb(255,0,0)";
								},
							},
							spanGaps: true,
						};
					}
				),
			};
		}
	}
	async function update_chart() {
		//console.log('update function was called right now')
		/* if (compressor_index === undefined && debug_mode) {
			console.log(Object.keys(filters).length);
		} */
		set_alert_statuses((prev_state) => {
			return {
				filtered_logs_length_zero: false,
				fetch_error: false,
			};
		});
		try {
			var data_file_hash = await custom_ajax({
				route: "/data_file_hash",
			});
			//console.log(data_file_hash)
			if (data_file_hash !== null) {
				if (window.local_data_file_hash === data_file_hash) {
					window.local_data_file_hash = data_file_hash;
					console.log(
						"data file has not changed since last update so updating process was terminated"
					);
					return;
				} else {
					window.local_data_file_hash = data_file_hash;
				}
			}

			var fetched_data = await custom_ajax({
				route: "/",
			});
			if (fetched_data === null) {
				throw "fetch response was equal to null and it was not acceptable!"
			}
			set_data(fetched_data);
		} catch (error) {
			set_alert_statuses((prev_state) => {
				return {
					...prev_state, //todo make sure this kind of duplicating object and overriding a prop works well in all situations
					fetch_error: true,
				};
			});
			/* if (compressor_index === undefined && debug_mode) {
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
			/* if (compressor_index === undefined && debug_mode) {
				console.log(Object.keys(filters).length );
			} */
			window.charts[compressor_index].data = chart_data;
			window.charts[compressor_index].update();
		}
	}
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
			if (window.interval_ids === undefined) {
				window.interval_ids = {};
			}
			window.interval_ids[compressor_index] = setInterval(() => {
				if (compressor_index === undefined && debug_mode) {
					if (window.last_interval_timestamp === undefined) {
						window.last_interval_timestamp = new Date().getTime();
					}
					console.log(
						(new Date().getTime() - window.last_interval_timestamp) / 1000 +
							"seconds are past from last time"
					);
					window.last_interval_timestamp = new Date().getTime();
				}
				update_chart();
			}, fetch_result.settings.update_cycle_duration * 1000);
			//console.log(`a interval was set with interval time = ${ fetch_result.settings.update_cycle_duration * 1000}`)
		};
		tmp();
		update_chart();
	}, []);
	useEffect(() => {
		 //todo make sure in the first time it runs past useEffect or ... has done its job (or make sure it doesnt depend on that's job!)
		update_chart()
	},[filters])
	useEffect(() => {
		return () => {
			//clearing upadate interval
			if (window.interval_ids[compressor_index]) {
				clearInterval(window.interval_ids[compressor_index]);
			}
		};
	}, []);
	var possible_options_for_from_limit = [20, 60, 120, 180, 300, 600]
	return (
		<div
			className={[
				"border border-blue-700 rounded m-2 p-2 overflow-y-auto overflow-x-hidden",
				className,
			].join(" ")}
		>
			<div>
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
			<Section title="errors" className="mt-2 bg-sky-200 text-red-900">
				<div className="px-2">
					{data === null && <h1>loading ...</h1>}
					{data !== null &&
						data.logs.map((log, log_index) => {
							return (
								<React.Fragment key={log_index}>
									<p
										className="my-2"
										
									>{`log #${log_index} which is submited at "${new Date(
										log.date
									).toUTCString()}" has ${
										Object.keys(log.common.errors).length
									} errors with the following values : ${JSON.stringify(
										log.common.errors
									)}`}</p>
									{log_index !== data.logs.length - 1 && <hr />}
								</React.Fragment>
							);
						})}
				</div>
			</Section>
			<Section title="how long do you want to see logs of ?" className="mt-2 bg-sky-600 text-white">
				<div className="px-2 pt-2">
					<p className="text-blue-900 bg-yellow-300 rounded border border-green-200 px-2">note : unlike the earlier versions of this application, now whenever you modify filters, your newly added filters will immediately effect and chart update process will start</p>
					<div className="flex space-x-1 flex-row flex-wrap mb-2 mt-2">
						{
							possible_options_for_from_limit
								.concat([
									filters['from'] !== undefined &&
										!possible_options_for_from_limit.includes(filters['from']) ? filters['from'] : null
								])
								.filter(i => i !== null)
								.map((number,index) => {
							return (
								<p
									key={index}
									onClick={() => {
										if (filters["from"] === number) {
											set_filters((old_filters) => ({
												...old_filters,
												from: undefined,
											}));
										} else {
											set_filters((old_filters) => ({
												...old_filters,
												from: number,
											}));
										}
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
					<hr className="mt-4"/>
					<p className="mt-2 block">or enter a duration manually (in seconds) :</p>
					<input
						id="time_limit_input"
						className="text-black px-2 border border-blue-400 rounded my-1 inline-block"
					/>
					<button
						onClick={() => {
							var time_limit = Number(document.getElementById("time_limit_input").value);
							set_filters((old_filters) => ({
								...old_filters,
								from: time_limit,
							}));
							alert(
								"your newly added filters will effect on the first future update"
							);
						}}
						className="border border-blue-400 rounded mx-2 px-2 mt-1 inline-block"
					>
						submit change{" "}
					</button>
				</div>
			</Section>
		</div>
	);
}
