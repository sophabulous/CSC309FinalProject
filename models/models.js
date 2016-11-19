var models = [
    "store-model.js",
    "fruit-model.js"
];

exports.init = function () {
    for (let i = 0, len = models.length; i < len; i++) {
        let model = "./" + models[i];
        require(model)();
    }
};
