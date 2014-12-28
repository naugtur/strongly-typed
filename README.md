strongly-typed
==============

Strongly-typed JavaScript objects, self-validating, with detailed error reports.

## Usage

```javascript
var TypeName = StronglyTyped(interface_definition, [prototype])

```

`interface_definition` is a plain object of the expected structure with fields containing values to match `typeof` in the typed objects.

_Example_

```javascript
var Person = StronglyTyped({
    "name": {
        first:"string",
        last:"string"
    },
    "age": "number"
})

//create instance
var joe = new Person({
    "name": {
        first:"Joe",
        last:"Average"
    },
    "age": 52
})
```
