var express = require('express')
var cors = require('cors')
const { process_data } = require('./data_parser.cjs')
var fs = require('fs')
var app = express()
app.use(cors())
app.use(express.json())

//initializing settings.json
if (!fs.existsSync('./settings.json')) {
    fs.writeFileSync('./settings.json', JSON.stringify({}))
}
var processed_data = process_data(process.env.data_absolute_file_path)
app.get('/compressors', (req, res) => {
    try {
        res.status(200)
        res.json(processed_data)
    } catch (e) {
        res.status(500)
        res.json(e)
    }
})
app.get('/compressors/:compressor_id', (req, res) => {
    try {
        res.status(200)
        res.json(processed_data)
    } catch (e) {
        res.status(500)
        res.json(e)
    }
})

app.get('/common', (req, res) => {
    res.json({
        
    })
})
app.get('/settings', (req, res) => {
    try {
        res.json(JSON.parse(fs.readFileSync('./settings.json','utf8')))
    } catch (e) {
        res.status(500)
        res.json(e)
    }
})
app.post('/settings', (req, res) => {
    try {
        console.log(req.body)
        fs.writeFileSync('./settings.json', JSON.stringify(req.body.settings)) //received settings should be JSON stringified
        res.json({})
    } catch (e) {
        res.status(500)
        res.json(e)
    }
})
app.listen(4000, () => {
    console.log('server is listening on port 4000')
})