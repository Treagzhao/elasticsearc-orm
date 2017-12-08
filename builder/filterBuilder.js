let termBuilder = (obj, item) => {
    obj.term = {};
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