export class Throttle {

    timeoutIdMap = new Map()

    create(func,wait) {
        let ctx, args, rtn;
        let last = 0;
        const that = this

        return function throttled() {
            ctx = this;
            args = arguments;
            let delta = new Date() - last;
            
            if (!that.timeoutIdMap.get(func)) {
                if (delta >= wait) { 
                    call()
                } else {
                    const timeoutID = setTimeout(call, wait - delta)
                    that.timeoutIdMap.set(func, timeoutID)
                }
            }

            return rtn;
        };

        function call() {
            that.timeoutIdMap.set(func, 0)
            last = +new Date();
            rtn = func.apply(ctx, args);
            ctx = null;
            args = null;
        }   
    }

    clear() {
        Array.from(this.timeoutIdMap.values()).forEach(id => {
            if (id) {
                clearTimeout(id)
            }
        })
        this.timeoutIdMap.clear()
    }
}
