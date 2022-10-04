import { useEffect } from "react"
import { useState } from "react"
import { custom_ajax } from "../custom_ajax"
import { Section } from "../common_components/Section.jsx"
import {ChartsColorSelector} from "./chartsColorSelector.jsx"
import { SelectUpdateCycleSection } from "./SelectUpdateCycleSection"
export function Settings() {
    var [settings,set_settings] = useState(null)
    function fetch_data() {
        custom_ajax({
            route : "/"
        }).then(data => {
            set_settings(data.settings )
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
                    <Section title='selecting chart colors' className="mb-2">
                        <ChartsColorSelector update_the_parent={fetch_data} />
                    </Section>
                    <SelectUpdateCycleSection />
                    
                </>
            )}
        </div>
    )
}