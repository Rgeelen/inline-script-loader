'use strict';

function ScriptLoader (que) {
  this.que = que
  this.runScripts();
}
    
ScriptLoader.prototype.isDependencyLoaded = function (dep, cb) {

   if (!dep && typeof cb === 'function') {
            cb();
    }

    var arrDep = dep,
        InitDeplen = dep.length,
        amountLoaded = 0,
        timer = null;

    (function checkDep() {
        var depLen = arrDep.length;

        for (var i = 0; i < depLen; i++) {
            if (window[dep[i]] === undefined) {
                timer = setTimeout(checkDep, 100);
            } else {
                //The callback should be triggered when all dependencies are loaded
                arrDep.splice(i, 1);
                amountLoaded++;

                if (typeof cb === 'function' && amountLoaded === InitDeplen) {
                    clearTimeout(timer);
                    cb();
                }
            }
        }
    }());
}

ScriptLoader.prototype.runScripts = function () {
    var len = this.que.length;

    for (var i = 0; i < len; i++) {
        
        if (typeof this.que[i][0] === 'object') {
            var obj = this.que[i][0][this.que[i][1]]();

        
        } else if (typeof this.que[i][0] === 'function'){            
            var func = this.que[i][0];

            this.isDependencyLoaded(this.que[i][1], function(){
                    func();
            });
        }

    }
}

new ScriptLoader(ccm_script_que);