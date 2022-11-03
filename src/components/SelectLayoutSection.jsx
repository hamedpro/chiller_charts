import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Section } from "../common_components/Section";
import { custom_ajax } from "../custom_ajax";
export const SelectLayoutSection = ({ fetch_data_func, settings }) => {
    var [layout, set_layout] = useState(settings.layout)
    //possible values for layout : "1col" || "2col"
    function update_layout(new_layout) {
        custom_ajax({
            route: '/settings',
            body: {
                layout : new_layout
            },
            method : "POST"
        }).then(data => {
            alert('done successfuly')
            fetch_data_func()
        }, error => {
            alert('something went wrong while trying to ask server to update layout mode (error will be loged in dev console)')
            console.log(error)
        })
    }
    useEffect(() => {
        set_layout(settings.layout )
    },[settings])
    return (
        <Section title="selecting layout mode" className="mt-2">
            <span>charts can be shown in 2 ways : in a single column or in 2 column : select one of those styles :</span>
            {["1col", "2col"].map((value,index) => {
                return (
                    <div key={index} onClick={()=>update_layout(value)}>
                        {value === layout ? <CheckBox /> : <CheckBoxOutlineBlank />} {value === "1col" ? "single column mode" : "2 column mode "}
                    </div>
                )
            })}
        </Section>
    );
};
