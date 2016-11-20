module.exports = {

    displayHome: function (req, res) {
        res.sendFile('/public/index.html');
    }
};
