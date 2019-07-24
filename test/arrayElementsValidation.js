var stronglyTyped = require("../");
var assert = require("assert");

var BackwardCapability = stronglyTyped({
    array: []
});

var SimpleValue = stronglyTyped({
    array: [
        "string"
    ]
});

var Object = stronglyTyped({
    array: [
        {
            value: "string"
        }
    ]
});

assert.doesNotThrow(function() {
    BackwardCapability({
        array: [
            "a",
            2,
            { value: "c" }
        ]
    })
});

assert.doesNotThrow(function() {
    SimpleValue({
        array: [
            "a",
            "b",
            "c"
        ]
    })
});

assert.throws(function() {
    SimpleValue({
        array: [
            "a",
            2,
            "c"
        ]
    })
});

assert.doesNotThrow(function() {
    Object({
        array: [
            { value: "a" },
            { value: "b" },
            { value: "c" }
        ]
    })
});

assert.throws(function() {
    Object({
        array: [
            { value: "a" },
            { value: 2 },
            { value: "c" }
        ]
    })
});