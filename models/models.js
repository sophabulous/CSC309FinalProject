/* the idea to separate models in this way was borrowed from this source:
 http://www.white-skies.com/2013/02/how-to-set-up-mongoose-mongo-schemas.html
*/

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
