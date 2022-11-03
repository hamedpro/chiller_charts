function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function custom_rand(max) {
	return randomIntFromRange(1, max);
}
function gen_fake_compressor() {
	return {
		meta: {
			id: custom_rand(12),
			is_on: true,
		},
		data: {
			temp_suc: custom_rand(25),
			temp_dis: custom_rand(21),
			temp_ev: custom_rand(22),
			temp_liq: custom_rand(23),
			p_suc: custom_rand(24),
			p_dis: custom_rand(25),
			"ct1-1": custom_rand(26),
			"ct1-2": custom_rand(27),
			ev_pulse: custom_rand(28),
			super_hit: custom_rand(29),
			subcool: custom_rand(30),
		},
	};
}
var gen_log = () => {
	return {
		date: new Date().getTime() - 40000,
		common: {
			errors: {
				2: 4,
				3: 5,
			},
			data: {
				temp_inlet: custom_rand(10),
				temp_outlet: custom_rand(12),
				temp_hit1: custom_rand(13),
				temp_hit2: custom_rand(14),
				temp_amb: custom_rand(15),
				temp_box: custom_rand(16),
				set_point: custom_rand(17),
				ct_fan1: custom_rand(18),
				ct_fan2: custom_rand(19),
				ct_pump: custom_rand(20),
				is_fan_box_on: true,
				is_fan_on: true,
			},
		},
		compressors: [1, 2, 3].map(gen_fake_compressor),
	};
};
var gen_fake_data = () => {
	return {
		settings: {},
		logs: [1, 2, 3, 4].map(gen_log),
	};
};
module.exports = {
	gen_fake_data,
};
