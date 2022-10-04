import { Circle, CircleOutlined } from "@mui/icons-material";
import { palette } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import { custom_ajax } from "../custom_ajax";

export function ChartsColorSelector({update_the_parent}) {
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    function gen_5_palettes() {
        return [1, 2, 3, 4, 5].map(() => {
            return [1,2,3,4,5,6,7,8,9,10].map(getRandomColor)
        })
    }
    var [palettes, set_palettes] = useState(gen_5_palettes)
    var [selected_palette_index,set_selected_palette_index] = useState(null)
    useEffect(() => {
        //console.log(palettes)
    },[])
    function apply_color_palette() {
        if (selected_palette_index === null) {
            alert('you have not selected any palette')
            return
        }
        custom_ajax({
            route: "/settings",
            method: "POST",
            body: {
                color_palette : palettes[selected_palette_index]
            }
        }).then(data => {
            alert('done successfuly!')
        }, e => {
            alert('something went wrong when uploading the settings changes')
            console.log(e)
        }).finally(update_the_parent)
    }
    return (
        <>
            <h1>select one of these existing color palettes or click the regenerate palettes button</h1>
            <div id="palettes" className="flex h-56 w-full justify-between p-2 px-1">
                {palettes.map((palette, index)=>{
                    return (
                        
                            <div key={index} className="w-1/6 border border-blue-400 rounded">
                                {palette.map((color, color_index) => {
                                    return (
                                        <div key={color_index} className="duration-300 w-full" style={{ height: "9%", background: color }}></div>
                                    )
                                })}
                            <div
                                className="w-full flex justify-center items-center cursor-pointer"
                                style={{ height: "10%" }}
                                onClick={()=>{set_selected_palette_index(index)}}
                            >{index === selected_palette_index ? <Circle /> : <CircleOutlined />}</div>

                            </div> 
                        
                    )
                })}
            </div>

            <button className="border border-stone-400 p-1 rounded block mb-1 mt-1" onClick={()=>set_palettes(gen_5_palettes)}>regenerate palettes</button>
            <button className="border border-stone-400 p-1 rounded" onClick={apply_color_palette}>apply this color palette</button>
        </>
    )
}