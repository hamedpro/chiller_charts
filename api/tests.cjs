const { simple_compare } = require('./helpers.cjs')

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
test_result({
    name: "simple_compare function",
    result: simple_compare({ name: "hamed", lname : "yaghoot"}, {lname : "yaghoot",name : "hamed"})
})