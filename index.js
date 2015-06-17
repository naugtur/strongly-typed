"use strict";


function validate(obj, desc, parent) {
    if (!desc) {
        return []
    }
    parent = parent || '';
    var errors = [];
    Object.keys(desc).forEach(function (key) {
        var descriptionVal = desc[key];
        if (typeof descriptionVal === "string") {
            if (typeof obj[key] !== descriptionVal) {
                errors.push(parent + key + ':' + (typeof obj[key]));
            }
        } else {
            if (Array.isArray(descriptionVal)) {
                if (!Array.isArray(obj[key])) {
                    errors.push(parent + key + ':notArray');
                }
            } else {
                if (obj.hasOwnProperty(key)) {
                    errors = errors.concat(validate(obj[key], descriptionVal, parent + key + '.'));
                } else {
                    errors.push(parent + key + ':missing');
                }
            }
        }

    });
    return errors;
}

module.exports = function (desc, proto, allowExtras) {
    var StronglyTyped = function StronglyTyped(obj) {
        var self = Object.create(StronglyTyped.prototype, {
            validate: {
                value: function validateType() {
                    var errors = validate(this, desc);
                    if (errors.length > 0) {
                        throw new TypeError("Incorrect values for fields: " + errors.join());
                    }
                    if (StronglyTyped.prototype.validate) {
                        return StronglyTyped.prototype.validate.call(this);
                    }
                }
            }
        });
        Object.keys(obj).forEach(function (key) {
            if (allowExtras || desc.hasOwnProperty(key)) {
                self[key] = obj[key];
            } else {
                throw new TypeError("Unexpected field " + key);
            }
        });
        if (StronglyTyped.prototype.constructor && StronglyTyped.prototype.constructor.apply) {
            StronglyTyped.prototype.constructor.apply(self, arguments)
        }
        self.validate();
        return self;
    };
    StronglyTyped.prototype = proto || {};
    Object.defineProperty(StronglyTyped, "created", {
        value: function (obj) {
            return StronglyTyped.prototype.isPrototypeOf(obj);
        }
    });
    return StronglyTyped;
};
