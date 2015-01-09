var StronglyTyped = require('../')
var assert = require('assert')

var TypeA = StronglyTyped({
    "a": "string",
    "b": "number"
})

var TypeB = StronglyTyped({
    "a": "string",
    "b": {
        c: "number"
    }
}, {
    somefield: "prototype field"
})

var TypeC = StronglyTyped({
    "a": {},
    "b": !"whatever falsy"
})

var Autoid1 = StronglyTyped({
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
var Autoid2 = StronglyTyped({
    "id": "number",
    "text": "string"
}, OriginalAutoid.prototype)

var InterfaceA = StronglyTyped({
    "methodname": "function"
})


assert.doesNotThrow(function () {
    var x = new TypeA({
        b: 123,
        a: "foo"
    })
    
    var y = new TypeB({
        b: {
            c: 123
        },
        a: "foo"
    })

    var z = new TypeC({
        b: null,
        a: null
    })
    
    var i = new InterfaceA({
        methodname: function () {}
    })

    var aa = new Autoid1({
        text: "foo"
    })
    var ab = new Autoid2({
        text: "foo"
    })
}, "expected object creation to succeed")


var x = new TypeB({
    b: {
        c: 123
    },
    a: "foo"
})

assert.ok(x.somefield, "expected prototype to be passed")

assert.doesNotThrow(function () {
    var x = new TypeA({
        b: 123,
        a: "foo"
    })

    var y = new TypeA(x)
}, "expected object creation from another object")


assert.throws(
    function () {
        var x = new TypeA({
            x: 123
        })
    },
    / x$/,
    "expected TypeError on incorrect object definition"
);

assert.throws(
    function () {
        var x = new TypeA({
            b: 123,
            a: "foo"
        })

        var y = new TypeB(x)
    },
    /b\.c:undefined/,
    "expected TypeError on object from object"
);

assert.throws(
    function () {
        var x = new TypeB({
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
        var x = new TypeB({
            a: "foo"
        })
    },
    /b:missing/,
    "expected TypeError on incorrect object definition2"
);

assert.throws(
    function () {
        var x = new TypeB({
            a: "foo",
            b: {
                c: "A"
            }
        })
    },
    /b\.c:string$/,
    "expected TypeError on incorrect object definition3"
);

console.log('done');