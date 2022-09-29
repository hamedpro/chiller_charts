import { Circle, CircleOutlined } from "@mui/icons-material"
import { useEffect } from "react"
import { useState } from "react"
import { custom_ajax } from "../custom_ajax"

export function ChartsThemeSelector() {
    var [selected_theme, set_selected] = useState(null)
    function fetch_data() {
        
    }
    function upload_new_theme(new_mode) {
        //customAjax stuff
        //.finally : fetch_data
    }
    useEffect(fetch_data,[])
    return (
        <div className="flex justify-between w-full h-40 px-3">
            <div className="w-2/5 h-full flex items-center justify-center flex-col space-y-2">
                <div className="w-full h-1/2 bg-blue-600 rounded text-white flex justify-center items-center">
                    dark mode
                </div>
                <div onClick={()=>{upload_new_theme("dark")}}>{selected_theme === "dark" ? <Circle /> : <CircleOutlined />}</div>
            </div>
            <div className="w-2/5 h-full flex items-center justify-center flex-col space-y-2">
                <div className="w-full h-1/2 border border-blue-600 rounded text-blue-700 flex justify-center items-center">
                    light mode
                </div>
                <div onClick={()=>{upload_new_theme("light")}}>{selected_theme === "light" ? <Circle /> : <CircleOutlined />}</div>
            </div>
        </div>
    )
}