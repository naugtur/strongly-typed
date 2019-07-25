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

var ObjectValue = stronglyTyped({
    array: [
        {
            value: "string"
        }
    ]
});

var FreakyValue = stronglyTyped({
    outerArray: [
        {
            innerArray: [
                {
                    value: "string"
                }
            ]
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
    ObjectValue({
        array: [
            { value: "a" },
            { value: "b" },
            { value: "c" }
        ]
    })
});

assert.throws(function() {
    ObjectValue({
        array: [
            { value: "a" },
            { value: 2 },
            { value: "c" }
        ]
    })
});

assert.doesNotThrow(function () {
    FreakyValue({
        outerArray: [
            {
                innerArray: [
                    {
                        value: "a"
                    },
                    {
                        value: "b"
                    }
                ]
            },
            {
                innerArray: [
                    {
                        value: "c"
                    },
                    {
                        value: "d"
                    }
                ]
            }
        ]
    })
});

assert.throws(function () {
    FreakyValue({
        outerArray: [
            {
                innerArray: [
                    {
                        value: "a"
                    },
                    {
                        value: "b"
                    }
                ]
            },
            {
                innerArray: [
                    {
                        value: 3
                    },
                    {
                        value: "d"
                    }
                ]
            }
        ]
    })
});