"use strict"

function each(ob, f) {
    for (var i in ob) {
        if (ob.hasOwnProperty(i)) {
            f(ob[i], i)
        }
    }
}

function validate(obj, desc, parent) {
    if (!desc) {
        return []
    }
    parent = parent || ''

    var errors = []
    each(desc, function (descriptionVal, key) {
        if (typeof descriptionVal === "string") {
            if (!(typeof obj[key] === descriptionVal)) {
                errors.push(parent + key + ':' + (typeof obj[key]))
            }
        } else {
            if (obj.hasOwnProperty(key)) {
                errors = errors.concat(validate(obj[key], descriptionVal, parent + key + '.'))
            } else {
                errors.push(parent + key + ':missing')
            }
        }

    })
    return errors
}

module.exports = function (desc, proto, allowExtras) {
    var F = function (obj) {
        var self = this
        each(obj, function (val, key) {
            if (allowExtras || desc.hasOwnProperty(key)) {
                self[key] = val
            } else {
                throw new TypeError("Unexpected field " + key)
            }
        })
        if (proto) {
            proto.constructor.apply(this, arguments)
        }
        self.validate()
    }
    F.prototype = proto || {}
    var superValidate = proto && proto.validate
    F.prototype.validate = function () {
        var errors = validate(this, desc)
        if (errors.length > 0) {
            throw new TypeError("Incorrect values for fields: " + errors.join())
        }
        if (superValidate) {
            return superValidate.call(this)
        }
    }

    return F
}