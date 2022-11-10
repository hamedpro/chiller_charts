var crypto = require('crypto')
function items_are_same(array, log_diffrences = false) {
    var diffrences = []
    for (let i = 0; i < array.length; i++){
        for (let j = 0; j < array.length; j++){
            if (array[i] !== array[j]) {    
                diffrences.push([
                    {
                        index: i,
                        value : array[i]
                    },
                    {
                        index: j,
                        value : array[j]
                    }
                ])
                there_is_diffrences = true
            }
        }
    }
    if (log_diffrences) {
        console.log(diffrences)
    }
    return diffrences.length === 0
}
function simple_compare(item1, item2) {
    /* this is designed to compare simple objects or arrays like {name : "hamed",lname : "yaghoot"} or [1,23,"hamed"]
    and doesnt care about prototype related stuff and ... */
    
    function simple_compare_objects(obj1, obj2) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false
        } else {
            for (key in obj1) {
                return (obj1[key] == obj2[key])
            }
        }
    }
    function simple_compare_arrays(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false 
        }
        for (let i = 0; i < arr1.length; i++){
            return arr1[i] === arr2[i]
        }
    }
    if (typeof item1 !== typeof item2) {
        return false
    } else {
        if (typeof item1 === 'object') {
            //todo add check exactly item1,item2 are simple object
            if (Array.isArray(item1) && Array.isArray(item2)) {
                return simple_compare_arrays(item1,item2) 
            } else {
                return simple_compare_objects(item1,item2)
            }
        } else {
            return item1 === item2
        }
    }
    
}
function calc_sha256(input) {
    const hash = crypto.createHash('sha256').update(input).digest('base64');
    return hash 
}
function gen_rand_string(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function gen_window_var() {
    console.log(calc_sha256(gen_rand_string(5)))
}
module.exports = {
    items_are_same,
    simple_compare,
    calc_sha256,
    gen_rand_string,
    gen_window_var
}