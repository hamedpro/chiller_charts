import { useEffect } from "react"
import { useState } from "react"
import { Section } from "../common_components/Section"
import { custom_ajax } from "../custom_ajax"
import { SelectLayoutSection } from "./SelectLayoutSection"
import { SelectUpdateCycleSection } from "./SelectUpdateCycleSection"
export function Settings() {
    var [settings,set_settings] = useState(null)
    function fetch_data() {
        custom_ajax({
            route : "/"
        }).then(data => {
            set_settings(data.settings)
        }, error => {
            alert('something went wrong !')
            console.log(error)
        })
    }
    useEffect(fetch_data, [])
    return (
        <div className="p-2">
            {settings === null && (
                <h1>settings are being loaded </h1>
            )}
            {settings !== null && (
                <>
                    {/* <h1>{ JSON.stringify(settings)}</h1> */}
                    <SelectUpdateCycleSection />
                    <SelectLayoutSection
                        settings={settings}
                        fetch_data_func={fetch_data}
                    />
                </>
            )}
        </div>
    )
}