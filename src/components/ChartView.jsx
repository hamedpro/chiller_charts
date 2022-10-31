import { CheckBox, CheckBoxOutlineBlankOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { custom_ajax } from "../custom_ajax";

export function ChartView({ type, compressor_index = undefined }) {
	var [filters, set_filters] = useState({});
	var [data, set_data] = useState(null);

	function build_chart_data(data_prop) {
		/* console.log(data_prop) */
		if (data_prop === null || data_prop.logs.length === 0) {
			return null;
		}

		var filtered_data = { ...data_prop };
		if (Object.keys(filters).length !== 0) {
			if (filters["from"]) {
				filtered_data.logs = filtered_data.logs.filter((log) => {
					Number(log.date) >= filters["from"];
				});
			}
			if (filters["to"]) {
				filtered_data.logs = filtered_data.logs.filter((log) => {
					Number(log.date) <= filters["to"];
				});
			}
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
		try {
			var fetched_data = await custom_ajax({
				route: "/",
			});
			set_data(fetched_data);
		} catch (error) {
			//todo show badge with text saying there was something wrong with fetch request
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
		/* console.log({
			chart_data
		}) */
		if (chart_data === null) {
			delete window.charts[compressor_index].data;
			window.charts[compressor_index].update();
			/* todo : show a banner saying there is not any logs to show 
			(either becuse filters or even becuse there is not any log present in server response ) */
		} else {
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
		update_chart();
	}, [filters]);

	/* todo register an interval to update the chart every for ex 2 secs using this line below: 
	setInterval(update_chart,2000) */
	return (
		<div className="border border-blue-400 m-2 p-2">
			<div>
				<p className={["text-red-500", data === null ? "block" : "hidden"].join(" ")}>
					data is being loaded
				</p>
				<p
					className={[
						"text-red-500",
						build_chart_data(data) === null ? "block" : "hidden",
					].join(" ")}
				>
					data is loaded but there is not any logs to show considering your filters
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
								onClick={() =>
									set_filters((old_filters) => ({
										...old_filters,
										from: new Date().getTime() - number * 1000,
										time_limit: number,
									}))
								}
								className="inline border-blue-400 border rounded-lg h-fit mt-1 px-1 hover:bg-blue-600 hover:text-white cursor-pointer duration-300"
							>
								{filters["time_limit"] === number ? (
									<CheckBox />
								) : (
									<CheckBoxOutlineBlankOutlined />
								)}
								{number} seconds
							</p>
						);
					})}
					<span className="mt-2">or enter a duration manually (in seconds) :</span>{" "}
					<input
						onChange={(event) => {
							var time_limit = event.target.value;
							set_filters((old_filters) => ({
								...old_filters,
								from: new Date().getTime() - time_limit * 1000,
								time_limit,
							}));
						}}
						className="px-2 border border-blue-400 rounded my-1"
					/>
				</div>
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
