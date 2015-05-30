strongly-typed
==============

Strongly-typed JavaScript objects, self-validating, with detailed error reports.

## Support

IE9+ and everything else (same support as `Object.create`)

## Usage

```javascript
var TypeName = stronglyTyped(interface_definition, [prototype], [allowUnspecifiedFields])

```

`interface_definition` is a plain object of the expected structure with fields containing strings to match `typeof` in the typed objects.

You can also use `null` or empty `{}` to indicate that the field must exist, without specifying anything else about it.

You can also use `[]` to enforce field being an array (as `typeof` retrns `"object"` for arrays).

_Example_

```javascript
var Person = stronglyTyped({
    "name": {
        first:"string",
        last:"string"
    },
    "age": "number",
    "favorites": []
})

//create instance
var joe = Person({
    "name": {
        first:"Joe",
        last:"Average"
    },
    "age": 52,
    "favorites": ["beer","game"]
})

//check type
Person.created(joe) === true
```

More examples in tests/index.js

## No new keyword

Strongly typed objects are factories, not classes. Because it's better that way. See: https://medium.com/javascript-scene/how-to-fix-the-es6-class-keyword-2d42bb3f4caf

