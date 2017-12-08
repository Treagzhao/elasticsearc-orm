let termBuilder = (obj, item) => {
    if (!obj.term) {
        obj.term = {};
    }
    obj.term[item.name] = item.value;
};


module.exports = (filterList) => {
    let obj = {};
    filterList.forEach((item) => {
        if (item.type === 'term') {
            termBuilder(obj, item);
        }
    });
    return obj;
};