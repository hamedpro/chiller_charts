import React from 'react'
import { Section } from '../common_components/Section'
import { custom_ajax } from '../custom_ajax'

export const DataAbsoluteFilePathSection = ({settings, fetch_data_func}) => {
    function update_settings(){
        var new_data_absolute_file_path = window.prompt('enter new value here :')
        if(new_data_absolute_file_path === null) return 
        custom_ajax({
            route: "/settings",
            method: 'POST',
            body: {
                data_absolute_file_path : new_data_absolute_file_path
            }
        }).then(data => {
            alert('done!')
        }, error => {
            alert("something went wrong when trying to ask server to update this field : 'data_absolute_file_path' : more information in dev console")
            console.log(error)
        }).finally(fetch_data_func)
        //todo alert the user and prevent the operation if the entered file path doesnt exists
    }
    return (
      <Section title="data_absolute_file_path selection section" className="mt-2">
            <p>enter absolute path of your data file (where your file is located exactly in the server machine)</p>
            <p className='text-blue-900'>current value : "{settings.data_absolute_file_path === null ? "not specified" : settings.data_absolute_file_path}"</p>
            <button
                onClick={update_settings}
                className='border border-blue-400 px-1 rounded mt-2 mb-1'
            >update value</button>
      </Section>
    
  )
}
