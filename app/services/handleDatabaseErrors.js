'use strict';

module.exports.handleSaveErrors = function (err) {
    for (let errName in err.errors) {
        if (err.errors.hasOwnProperty(errName)) {
            return err.errors[errName].message;
        }
    }
};
