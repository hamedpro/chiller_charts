var path = require('path')
var express = require('express')
var cors = require('cors')
const { process_data } = require('./data_parser.cjs')
var fs = require('fs')
var app = express()
app.use(cors())
app.use(express.json())
var gen_fake_data = require('./fake_data.cjs').gen_fake_data
var paths = {
    settings: path.join(__dirname, 'settings.json'),
    default_settings: path.join(__dirname, 'default_settings.json'),
    processed_data: path.join(__dirname, 'processed_data.json')
}

if (!fs.existsSync()) {
    fs.writeFileSync(paths.settings, JSON.stringify({}))
    console.log('settings.json was created automatically')
}
function get_settings() {
    var current_settings = JSON.parse(fs.readFileSync(paths.settings, 'utf8'))
    var default_settings = JSON.parse(fs.readFileSync(paths.default_settings, 'utf8'))
    Object.keys(current_settings).forEach(key => {
        default_settings[key] = current_settings[key]
    })
    return default_settings
}
var processed_data = process_data(process.env.data_absolute_file_path)
app.get('/', (req, res) => {
    try {
        /* res.json({
        settings : get_settings(),
        ...processed_data
        }) */
        var generated_fake_data = gen_fake_data()
        generated_fake_data['settings'] = get_settings()

        res.json(generated_fake_data)
    } catch (e) {
        res.status(500)
        res.json(e)
    }
    
})
app.post('/settings', (req, res) => {
    try {
        var settings = get_settings()
        Object.keys(req.body).forEach(key => {
            settings[key] = req.body[key]
        })
        console.log(JSON.stringify(settings))
        fs.writeFileSync('./settings.json', JSON.stringify(settings)) //received settings should be JSON stringified
        res.json({})
    } catch (e) {
        res.status(500)
        res.json(e)
    }
})
app.listen(4000, () => {
    console.log('server is listening on port 4000')
})