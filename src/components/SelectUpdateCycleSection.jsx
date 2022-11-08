import { CircleOutlined ,Circle, CheckBox, CheckBoxOutlined, CheckBoxOutlineBlank} from "@mui/icons-material";
import { useEffect } from "react";
import { useState } from "react";
import { Section } from "../common_components/Section";
import { custom_ajax } from "../custom_ajax";
import swal from 'sweetalert';
export function SelectUpdateCycleSection() {
    var [selected_duration, set_selected_duration] = useState(null)
    function set_update_cycle_duration(new_duration) {
        custom_ajax({
            route: "/settings",
            body: {
                update_cycle_duration : Number(new_duration)
                //useless_field : "hamed"
            },
            method : "POST"
        }).then(data => { swal({
            text: "done successfuly",
            icon : "success"
        })         
        }, error => {
            swal({
            text: "something went wrong while trying to ask server to update 'update_cycle_duration' (error will be loged in dev console)",
            icon: "warning",
            dangerMode: true,
        })  
            console.log(error)
        }).finally(fetch_data)
    }
    function fetch_data() {
        custom_ajax({
            route : "/"
        }).then(data => {
            set_selected_duration(data.settings.update_cycle_duration)
        }, error => {
            alert('something went wrong')
            console.log(error)
        })
    }
    useEffect(fetch_data,[])
    return (
        <Section title="updating cycle">
            <p>
                how often do you want to fetch the new information and update charts from server ? (values are in seconds)
            </p>
            {[5,10,20,60,120].map((duration_in_seconds, index) => {
                return (
                    <p key={duration_in_seconds} onClick={ ()=>set_update_cycle_duration(duration_in_seconds)}>{selected_duration === duration_in_seconds ? <CheckBox /> : <CheckBoxOutlineBlank />} {duration_in_seconds}seconds</p>
                )
            })}
        </Section>
    )
}