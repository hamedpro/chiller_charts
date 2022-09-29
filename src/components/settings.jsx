import { useEffect } from "react"
import { useState } from "react"
import { custom_ajax } from "../custom_ajax"
import { Section } from "../common_components/Section.jsx"
import {ChartsColorSelector} from "./chartsColorSelector.jsx"
import { ChartsThemeSelector } from "./ChartsThemeSelector"
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
                    
                    <Section title='choosing layout of charts' className="mb-2">
                        <h1>coming soon feature! ... : this feature will be implented in future releases</h1>
                    </Section>
                    
                    <Section title='application theme' className="mb-2">
                        <ChartsThemeSelector />
                    </Section>
                    
                    <Section title='other options' className="mb-2">
                        <h1>coming soon feature! ... : this feature will be implented in future releases</h1>
                    </Section>

                </>
            )}
        </div>
    )
}