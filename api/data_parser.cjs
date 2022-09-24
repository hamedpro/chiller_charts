var fs = require('fs')
const path = require('path')
var read_data = (file_path) =>{
    return fs.readFileSync(file_path,'utf8')
}
function is_dot_or_number(char) { // it does only accept single characters
    return (char == "." | (isNaN(Number(char)) !== true))
}
function parse_data_part(string) {
    var result = {}
    var parts_count = string.match(/=/g).length 
    for (let i = 0; i < parts_count; i++){
        var key = string.split('=')[0]
        
        for (let j = 0; j <= key.length; j++){
            string = string.split('')
            string.shift()
            string = string.join('')
        }
        //console.log(string)
        var val = ""
        var count_of_numbers_or_dots = 0
        for (let z = 0; z < string.split('').length; z++){
            var letter = string.split('')[z]
            if (is_dot_or_number(letter)) {
                count_of_numbers_or_dots +=1
            } else {
                break;
            }
        }
       /*  console.log(string)
        console.log(`${count_of_numbers_or_dots} items should be shifted `) */
        string = string.split('')
        val = string.splice(0, count_of_numbers_or_dots)
        string = string.join('')
        result[key] = val.join('')
    }
    return result
}
function process_line(line) {
    var errors_part = line.match(/(.+)Er[0-9]*:[0-9]*(?! Er)/)[0]
    var data_part = line.match(/([A-Z a-z]+)(_*)([A-Z a-z]+)=(.+)/)[0].split('Clock')[0]
    var errors = errors_part.match(/Er([0-9]+):([0-9]+)/g)
    var tmp = {}
    errors.forEach(error => {
        var splited_error = error.split(':')
        if (Number(splited_error[1]) !== 0) {
            tmp[splited_error[0].replace('Er', '')] = splited_error[1]
        }
    })
    errors = tmp 
    return {
        errors: errors,
        data: parse_data_part(data_part),
        data_part
    }
}
function process_data(file_path, lines_limit = undefined) {
    var data = read_data(file_path)
    var processed_data = data.replaceAll("\r", "")

    processed_data = processed_data.split("\n")
    var lines = processed_data.slice(1, processed_data.length).map(raw_line => process_line(raw_line))
    lines = lines.slice(0, lines_limit ? lines_limit : lines.length)

    return {
        seperated_date:  "d" + processed_data[0].split(' d')[1],
        seperated_clock: processed_data[0].split(' d')[0],
        lines 
    }
}
function gen_processed_file(file_path,lines_limit=undefined) {
    fs.writeFileSync('processed_data.json',JSON.stringify(process_data(file_path,lines_limit),null,4))
}
//process_data('/home/hamedpro/coding/chiller_charts/data_example.txt')
//gen_processed_file('/home/hamedpro/coding/chiller_charts/data_example.txt')

gen_processed_file('/home/hamedpro/coding/chiller_charts/data_example.txt',2)
module.exports = {
    process_data
}