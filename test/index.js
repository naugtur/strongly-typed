var stronglyTyped = require('../')
var assert = require('assert')

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

var TypeBOptional = stronglyTyped({
    "a": "string",
    "?z": "string",
    "?b": {
        "?c": "number",
        d: "number"
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


// optional fields


assert.doesNotThrow(function () {
    var x = TypeBOptional({
        b: {
            c: 123,
            d: 123
        },
        a: "foo"
    })

    var y = TypeBOptional({
        a: "foo",
        z: "bar",
        b: {
            d: 123
        },
    })
}, "expected object with optional fields to succeed")


assert.throws(
    function () {
        var x = TypeBOptional({
            a: "foo",
            z:1
        })
    },
    /z:number$/,
    "expected TypeError on incorrect optional definition1"
);

console.log('done');
