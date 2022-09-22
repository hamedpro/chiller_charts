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
module.exports = {
    items_are_same
}