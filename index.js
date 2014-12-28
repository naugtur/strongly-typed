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
    //console.log('-r ' + parent, obj, desc);
    var errors = [];
    each(desc, function (val, key) {
        //console.log('v ' + key);
        if (typeof val === "string") {
            //console.log('  str');
            //check
            if (!(typeof obj[key] === val)) {
                //console.log('err found', obj[key], val)
                errors.push(parent + key+':'+(typeof obj[key]))
            }
        } else {
            //console.log('  recur');
            if (obj[key]) {
                errors = errors.concat(validate(obj[key], val, parent + key + '.'))
            } else {
                errors.push(parent + key+':missing')
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
        //console.log('self', self);
        self.validate()
    }
    F.prototype = proto || {}
    var superValidate = proto && proto.validate;
    F.prototype.validate = function () {
        var errors = validate(this, desc)
        //console.log(errors);
        if (errors.length > 0) {
            throw new TypeError("Incorrect values for fields: " + errors.join())
        }
        if (superValidate) {
            //console.log('calling proto.validate')
            return superValidate.call(this)
        }
    }

    return F
}