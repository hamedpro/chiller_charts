import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
//console.log(process.env);
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		API_BASE_PATH: JSON.stringify(process.env.API_BASE_PATH),
	},
});
