require('dotenv').config()
var path = require('path')
var express = require('express')
var cors = require('cors')
const { process_data } = require('./data_parser.cjs')
var fs = require('fs')
var app = express()
app.use(cors())
app.use(express.json())
var gen_fake_data = require('./fake_data.cjs').gen_fake_data
var calc_sha256 = require('./helpers.cjs').calc_sha256

var paths = {
    settings: path.join(__dirname, 'settings.json'),
    default_settings: path.join(__dirname, 'default_settings.json'),
    processed_data: path.join(__dirname, 'processed_data.json')
}
if (!fs.existsSync(paths.settings)) {
    fs.writeFileSync(paths.settings, JSON.stringify({
        charts_background_color : "rgba(255, 99, 132, 0.2)",
        update_cycle_duration : 10,
        layout: "1col",
        data_absolute_file_path : null 
    }))
    console.log('settings.json was created automatically and it was filled by default settings')
}
function get_settings() {
    return current_settings = JSON.parse(fs.readFileSync(paths.settings, 'utf8'))
}
app.get('/data_file_hash', (req, res) => {
    var data_absolute_file_path = get_settings().data_absolute_file_path
    
    if (data_absolute_file_path !== null && fs.existsSync(data_absolute_file_path)) {
        res.json(calc_sha256(fs.readFileSync(data_absolute_file_path, 'utf8')))
    } else {
        res.json(null)
    }
})
app.get('/', (req, res) => {
    try {
        var settings = get_settings()
        if (settings.data_absolute_file_path === null) {
            var generated_fake_data = gen_fake_data()
            generated_fake_data['settings'] = get_settings()
            res.json(generated_fake_data)
        } else {
           var processed_data = process_data(settings.data_absolute_file_path)
            res.json({
            settings : get_settings(),
            ...processed_data
            }) 
        }
    } catch (e) {
        res.status(500).json(e)
    }
})
app.post('/settings', (req, res) => {
    try {
        var settings = get_settings()
        Object.keys(req.body).forEach(key => {
            settings[key] = req.body[key]
        })
        console.log('a request asked server to modify the settings : modified settings are going to be written :', { settings })
        fs.writeFileSync(paths.settings, JSON.stringify(settings))
        res.status(200).json({})
    } catch (e) {
        res.status(500).json(e)
    }
})
app.listen(4000, () => {
    console.log('server is listening on port 4000')
})