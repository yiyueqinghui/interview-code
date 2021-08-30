
// 每一个Promise处理一个独立的异步任务，当它处理的异步任务结束了以后，这个Promise就不再使用
class KPromise {

    queue = {
        resolved: [],
        rejected: []
    };

    constructor( handler ) {

        handler( this._resolve.bind(this), this._reject.bind(this) );

    }

    _resolve(val) {
        // setTimeout(() => {
            // console.log('_resolve');

            let ob = new MutationObserver((...args) => {
                // console.log('args', args)


                let resolvedHandler;

                while((resolvedHandler = this.queue.resolved.shift()) && typeof resolvedHandler === 'function') {
                    resolvedHandler(val);
                }

                ob.disconnect();
            });

            ob.observe(document.body, {
                attributes: true
            });
            document.body.setAttribute('_kkb', Math.random());





        // }, 0);
    }

    _reject(err) {
        // setTimeout(() => {
        //     // console.log('_reject');
        //
        //     let rejectedHandler;
        //
        //     while((rejectedHandler = this.queue.rejected.shift()) && typeof rejectedHandler === 'function') {
        //         rejectedHandler(err);
        //     }
        // }, 0);

        let ob = new MutationObserver((...args) => {
            // console.log('args', args)


            let rejectedHandler;

            while((rejectedHandler = this.queue.rejected.shift()) && typeof rejectedHandler === 'function') {
                rejectedHandler(err);
            }

            ob.disconnect();
        });

        ob.observe(document.body, {
            attributes: true
        });
        document.body.setAttribute('_kkb', Math.random());
    }

    then( resolvedHandler, rejectedHandler ) {

        // then 传入的两个函数都不能在这里进行调用！！！！，它是需要等当前这个Promise对象要执行的异步任务完成以后才调用
        // 我们需要把当前传入的这两个函数，先存储到一个队列中（数组）
        // resolvedHandler();

        // this.queue.resolved.push(resolvedHandler);

        // this.queue.rejected.push(rejectedHandler);

        // return this;    // 只能处理同步链式调用

        return new KPromise( (resolve, reject) => {
            // resolve();

            this.queue.resolved.push( val => {

                if (typeof resolvedHandler === 'function') {
                    val = resolvedHandler(val);

                    if (val instanceof KPromise) {
                        return val.then(resolve);
                    }

                    resolve(val);
                }

            } );

            this.queue.rejected.push( err => {

                if (typeof rejectedHandler === 'function') {
                    let val = rejectedHandler(err);

                    if (val instanceof KPromise) {
                        return val.then(resolve);
                    }

                    resolve(val);
                }
                resolve();
            } );

        } );

    }

    catch( rejectedHandler ) {
        return this.then(undefined, rejectedHandler);
    }

    static resolve(val) {
        return new KPromise(resolve => {
            resolve(val);
        });
    }

}