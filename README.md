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
Additionally those strings can be prefixed with question mark `?` to make them optional. If the field exist and is not null, it will be checked against the type.

You can also use `null` or empty `{}` to indicate that the field must exist, without specifying anything else about it.

You can also use `[]` to enforce field being an array (as `typeof` retrns `"object"` for arrays).

_Example_

```javascript
var Person = stronglyTyped({
    "name": {
        first:"string",
        last:"string",
        middle:"?string"
    },
    "age": "number",
    "phoneNumber": "?string"
    "favorites": []
})

//create instance
var joe = Person({
    "name": {
        first:"Joe",
        last:"Average"
    },
    "age": 52,
    // "phoneNumber": null, or not defined at all
    "favorites": ["beer","game"]
})

//check type
Person.created(joe) === true
```

If `[]` is left empty in description, inner elements of the array are not validated. If there is first element in the array description, it's treated as schema for each element inside the array. Additional elements in description are omitted.

_Example - array deep validation_

```javascript
var Person2 = stronglyTyped({
    "name": "string",
    "favorites": [
        {
            "id": "number",
            "value": "string"
        }
    ]
})

//create instance
var moe = Person2({
    "name": "Moe Average"
    "favorites": [
        { "id": 1, "value": "beer" },
        { "id": 2, "value": "game" }
    ]
})

//check type
Person2.created(moe) === true
```

More examples in tests/index.js

## No new keyword

Strongly typed objects are factories, not classes. Because it's better that way. See: https://medium.com/javascript-scene/how-to-fix-the-es6-class-keyword-2d42bb3f4caf

