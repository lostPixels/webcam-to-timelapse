exports.renderDate = function(epoche_time) {
    return new Date(epoche_time);
};

exports.renderStep = function(step) {
    return parseInt(step) - 1;
};