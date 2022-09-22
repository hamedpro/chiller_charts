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

app.get('/compressors', (req, res) => {
    try {
        var processed_data = process_data(process.env.data_absolute_file_path)
        res.status(200)
        res.json(processed_data)
    } catch (e) {
        res.status(500)
        res.json(e)
    }
})
app.get('/common', (req, res) => {
    res.send()
})
app.get('/settings', (req, res) => {
    try {
        res.json(JSON.parse(fs.readFileSync('./settings.json','utf8')))
    } catch (e) {
        res.status(500)
        res.json(e)
    }
})
app.listen(4000, () => {
    console.log('server is listening on port 4000')
})