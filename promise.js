function Promise(global) {
    var list = [];
    var _self = this;
    var errorHandler;
    this.resolve = (value) => {
        let args = Array.prototype.slice.call(arguments);
        var item = list.shift();
        try {
            if (item && item.success && typeof item.success === 'function') {
                item.success(value, this)
            };
        } catch (e) {
            errorHandler && errorHandler(e);
        }
    };
    this.catch = (fn) => {
        errorHandler = fn;
    }

    this.reject = (value) => {
        var item = list.shift();
        item && item.fail && typeof item.fail === 'function' && item.fail(value, this);
    };
    this.then = (successCbk, failCbk) => {
        list.push({
            'success': successCbk,
            'fail': failCbk
        });
        return this;
    }
};


Promise.all = function(promiseList) {
    'use strict';
    var args = [],
        result = [];
    var promise = new Promise();
    let count = 0;
    for (let i = 0; i < promiseList.length; i++) {
        args.push({
            'index': i,
            'promise': promiseList[i]
        });
    }
    var flag = args.every(function(item, index) {
        return (item.promise instanceof Promise);
    });

    var check = function() {
        if (count == args.length) {
            promise.resolve(result);
        }
    };

    if (!flag) {
        throw new Error("所有参数都必须是promise函数");
    }
    for (let i = 0; i < args.length; i++) {
        let item = args[i];
        item.promise.then(function(value) {
            result[i] = value;
            ++count;
            check();
        });
    }
    return promise;
};

Promise.when = function(cbk) {
    return cbk();
}


module.exports = Promise;