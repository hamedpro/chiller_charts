var fs = require('fs')
const path = require('path')
var read_data = (file_path) =>{
    return fs.readFileSync(file_path,'utf8')
}
function process_line(line) {
    var errors_part = line.match(/(.+)Er[0-9]*:[0-9]*(?! Er)/)[0]
    var data_part = line.match(/([A-Z a-z]+)(_*)([A-Z a-z]+)=(.+)/)[0].split('Clock')[0]
    return {
        errors_part,
        data_part,
        errors: JSON.stringify(errors_part.match(/Er([0-9]+):([0-9]+)/g)),
        data :  JSON.stringify(data_part.match(/(?![1-9]*)(.+)=([0-9]+)(\.)*([0-9]*)/g)) //todo fix this data field
    }
}
function process_data(file_path, lines_limit = undefined) {
    var data = read_data(file_path)
    var processed_data = data.replaceAll("\r", "")

    processed_data = processed_data.split("\n")
    var lines = processed_data.slice(1, processed_data.length).map(raw_line => process_line(raw_line))
    lines = lines.slice(0,lines_limit ? lines_limit : lines.length)
    return {
        seperated_date:  "d" + processed_data[0].split(' d')[1],
        seperated_clock: processed_data[0].split(' d')[0],
        lines 
    }
}
function gen_processed_file(file_path) {
    fs.writeFileSync('processed_data.json',JSON.stringify(process_data(read_data(file_path),1)))
}
//process_data('/home/hamedpro/coding/chiller_charts/data_example.txt')
//gen_processed_file('/home/hamedpro/coding/chiller_charts/data_example.txt')

module.exports = {
    process_data
}