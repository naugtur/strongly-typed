"use strict";


function validate(obj, desc, optionals, parent) {
    if (!desc) {
        return []
    }
    parent = parent || '';
    var errors = [];
    Object.keys(desc).forEach(function (key) {
        var descriptionVal = desc[key];
        // debug(key, obj[key], optionals[parent + key], parent + key)
        if(typeof obj[key] === "undefined" && optionals[parent + key]){
            // debug("skipping")
            return;
        }
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
                    errors = errors.concat(validate(obj[key], descriptionVal, optionals, parent + key + '.'));
                } else {
                    errors.push(parent + key + ':missing');
                }
            }
        }

    });
    return errors;
}

function treeApply(obj, func, parent){
    parent = parent || '';
    Object.keys(obj).forEach(function (key) {
        var newKey = func(obj, key, parent)
        // debug(typeof obj[key], key)
        if(typeof obj[newKey] === "object"){
            treeApply(obj[newKey], func, parent + newKey + '.')
        }
    })
}

module.exports = function (desc, proto, allowExtras) {
    var optionals={};
    treeApply(desc,function(obj, key, parentPath){
        if(key.substr(0,1) === "?"){
            var optionalKey = key.substring(1)
            obj[optionalKey] = obj[key]
            optionals[parentPath+optionalKey]=1;
            delete obj[key]
            return optionalKey;
        }
    })
    // debug(desc)

    var StronglyTyped = function StronglyTyped(obj) {
        var self = Object.create(StronglyTyped.prototype, {
            validate: {
                value: function validateType() {
                    var errors = validate(this, desc, optionals);
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
