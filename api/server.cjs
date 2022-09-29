var express = require('express')
var cors = require('cors')
const { process_data } = require('./data_parser.cjs')
var fs = require('fs')
var app = express()
app.use(cors())
app.use(express.json())
var gen_fake_data = require('./fake_data.cjs').gen_fake_data

//initializing settings.json
if (!fs.existsSync('./settings.json')) {
    fs.writeFileSync('./settings.json', JSON.stringify({}))
    console.log('settings.json was created automatically')
}
function read_settings() {
    return JSON.parse(fs.readFileSync('./settings.json', 'utf8'))
}
var processed_data = process_data(process.env.data_absolute_file_path)
app.get('/', (req, res) => {
    try {
        /* res.json({
        settings: JSON.parse(fs.readFileSync('./settings.json', 'utf8')),
        ...processed_data
        }) */
        res.json(gen_fake_data())
    } catch (e) {
        res.status(500)
        res.json(e)
    }
    
})
app.post('/settings', (req, res) => {
    try {
        var settings = read_settings()
        Object.keys(req.body).forEach(key => {
            settings[key] = req.body[key]
        })
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