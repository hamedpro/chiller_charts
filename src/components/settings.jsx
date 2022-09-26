import { useEffect } from "react"
import { useState } from "react"
import { custom_ajax } from "../custom_ajax"

export function Settings() {
    var [settings,set_settings] = useState(null)
    function fetch_data() {
        custom_ajax({
            route : "/settings"
        }).then(data => {
            set_settings(data)
        }, error => {
            alert('something went wrong !')
            console.log(error)
        })
    }
    function upload_settings(settings_to_upload) {
        custom_ajax({
            method: "POST",
            body: {
                settings : JSON.stringify(settings_to_upload)
            },
            route : "/settings"
        }).then(data => {
            alert('done successfuly!')
        }, error => {
            alert('something went wrong!')
            console.log(error)
        }).finally(fetch_data)
    }
    useEffect(fetch_data, [])
    return (
        <>
            {settings === null && (
                <h1>settings are being loaded </h1>
            )}
            {settings !== null && (
                <>
                    {/* <h1>{ JSON.stringify(settings)}</h1> */ }
                    <h1>settings was loaded successfuly</h1>
                </>
            )}
            <button onClick={() => upload_settings({ borders: "red" })}>upload fake settings</button>
        </>
    )
}