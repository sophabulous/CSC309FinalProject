var models = [
    "store-model.js",
    "fruit-model.js"
];

exports.init = function () {
    for (var i = 0; i < models.length; i++) {
        var model = "./" + models[i];
        require(model)();
    }
};
