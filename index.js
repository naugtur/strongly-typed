"use strict"

function each(ob, f) {
    for (var i in ob) {
        if (ob.hasOwnProperty(i)) {
            f(ob[i], i)
        }
    }
}

function validate(obj, desc, parent) {
    parent = parent || '';

    var errors = [];
    each(desc, function (val, key) {
        if (typeof val === "string") {
            //check
            if (!(typeof obj[key] === val)) {
                errors.push(parent + key + ':' + (typeof obj[key]))
            }
        } else {
            if (obj[key]) {
                errors = errors.concat(validate(obj[key], val, parent + key + '.'))
            } else {
                errors.push(parent + key + ':missing')
            }
        }

    });
    return errors;
}

module.exports = function (desc, proto) {
    var F = function (obj) {
        var self = this;
        each(obj, function (val, key) {
            if (desc[key]) {
                self[key] = val
            } else {
                throw new TypeError("Unexpected field " + key);
            }
        });
        if (proto) {
            proto.constructor.apply(this, arguments);
        }
        self.validate()
    }
    F.prototype = proto || {}
    var superValidate = proto && proto.validate;
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