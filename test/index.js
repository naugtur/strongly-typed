var stronglyTyped = require('../');
var assert = require('assert');

require("./arrayElementsValidation");

var TypeA = stronglyTyped({
    "a": "string",
    "b": "number",
    "c": []
})

var TypeB = stronglyTyped({
    "a": "string",
    "b": {
        c: "number"
    }
}, {
    somefield: "prototype field"
})

var TypeC = stronglyTyped({
    "a": {},
    "b": !"falsy indicates a field must exist, any type"
})

var TypeD = stronglyTyped({
    "a": "?string",
    "b": "?number"
})

var TypeE = stronglyTyped({
    "a": "?object",
    "b": {
        "c":"?number"
    }
})

var Autoid1 = stronglyTyped({
    "id": "number",
    "text": "string"
}, {
    constructor: function () {
        this.id = 123;
    }
})

function OriginalAutoid() {
    this.id = 123;
}
var Autoid2 = stronglyTyped({
    "id": "number",
    "text": "string"
}, OriginalAutoid.prototype)

var InterfaceA = stronglyTyped({
    "methodname": "function"
})


assert.doesNotThrow(function () {
    var x = TypeA({
        b: 123,
        a: "foo",
        c: []
    })

    var y = TypeB({
        b: {
            c: 123
        },
        a: "foo"
    })

    var z = TypeC({
        b: null,
        a: null
    })

    var i = InterfaceA({
        methodname: function () {}
    })

    var aa = Autoid1({
        text: "foo"
    })
    var ab = Autoid2({
        text: "foo"
    })
}, "expected object creation to succeed")


var x = TypeB({
    b: {
        c: 123
    },
    a: "foo"
})

var z = InterfaceA({
    methodname: function () {}
})

var ab = Autoid2({
    text: "foo"
})

assert.ok(x.somefield, "expected prototype to be passed")


assert.ok(TypeB.created(x), "expected instanceof to work")
assert.ok(!TypeB.created(z), "expected instanceof to work")

assert.equal(JSON.stringify(x), '{"b":{"c":123},"a":"foo"}');
assert.equal(JSON.stringify(ab), '{"text":"foo","id":123}');

assert.doesNotThrow(function () {
    var x = TypeA({
        b: 123,
        a: "foo",
        c: [1, 2, 3]
    })

    var y = TypeA(x)

    assert.equal(JSON.stringify(x), JSON.stringify(y));
    assert.ok(TypeA.created(y), "expected .created to work for descendants")

}, "expected object creation from another object")


assert.throws(
    function () {
        var x = TypeA({
            x: 123
        })
    },
    / x$/,
    "expected TypeError on incorrect object definition"
);

assert.throws(
    function () {
        var x = TypeA({
            b: 123,
            a: "foo",
            c: {}
        })
    },
    /c:notArray/,
    "expected TypeError on not an array"
);

assert.throws(
    function () {
        var x = TypeA({
            b: 123,
            a: "foo",
            c: []
        })

        var y = TypeB(x)
    },
    /Unexpected field c/,
    "expected TypeError on object from object"
);

assert.throws(
    function () {
        var x = TypeB({
            a: "foo",
            b: {
                x: 123
            }
        })
    },
    /b\.c:undefined/,
    "expected TypeError on incorrect object definition"
);

assert.throws(
    function () {
        var x = TypeB({
            a: "foo"
        })
    },
    /b:missing/,
    "expected TypeError on incorrect object definition2"
);

assert.throws(
    function () {
        var x = TypeB({
            a: "foo",
            b: {
                c: "A"
            }
        })
    },
    /b\.c:string$/,
    "expected TypeError on incorrect object definition3"
);

assert.doesNotThrow(function () {
    var x = TypeD({
        a: "test",
        b: 44
    })

    var y = TypeD({
        a: null,
        b: 44
    })

    var z = TypeD({
        a: "test",
        b: null
    })

    var w = TypeD({
        a: null,
        b: null
    })
    var e = TypeD({
        b: 44
    })

    var r = TypeD({
        a: "test"
    })

    var t = TypeD({
    })
}, "expected object creation with primitive optionals to succeed")

assert.throws(function() {
    var x = TypeD({
        a: true,
        b: true
    })
}, "expected object with optionals set to wrong values to throw")

assert.throws(function() {
    var x = TypeD({
        a: false,
        b: false
    })
}, "expected object with optionals set to false to throw")


assert.doesNotThrow(function () {
    var x = TypeE({
        a: {},
        b: {}
    })

    var y = TypeE({
        a: null,
        b: {}
    })

    var z = TypeE({
        b: {}
    })

    var w = TypeE({
        a: {},
        b: {
            c: 1
        }
    })

}, "expected object creation with optional object field to succeed")

assert.throws(function() {
    var x = TypeD({
        a: "nope",
        b: {}
    })
}, "expected optional object to validate when present")

assert.throws(function() {
    var x = TypeD({
        a: {}
    })
}, "expected object with only optional fields to still be required")


assert.throws(function() {
    var x = TypeD({
        a: {},
        b: {
            c: "nope"
        }
    })
}, "expected nested object with optionals set to invalid values to throw")

console.log('done');