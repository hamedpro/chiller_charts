var items_are_same = require('./helpers.cjs').items_are_same

function test_result({
    name,
    result
}) {
    console.log(`test "${name}" : ${result ? 'done' : 'failed'}`)
}

//todo make sure tests in this file cover all situations
test_result({
    name: 'items_are_same func',
    result : (items_are_same([1, 2, 3]) === false && 
    items_are_same([1, 1, 1]) === true &&
    items_are_same([3,1,1]) === false)
})
console.log(items_are_same([1,2,3],true))