import {PromiseStatus} from "../src/PromiseStatus";
import {Promise} from "../src/Promise";

describe("1. Basic Test", ()=>{
    it("Promise have a status of pending at the beginning", ()=>{
        let promise = new Promise((resolve, reject)=>{
        });
        expect(promise.status).toEqual(PromiseStatus.PENDING);
    });

    // it("Catch the error occur when executing the executor function ( sync )", ()=>{
    //     let promise = new Promise((resolve, reject)=>{
    //         throw new Error("Error on purpose");
    //     }).catch((reason)=>{
    //         expect(reason.toString()).toEqual("Error: Error on purpose");
    //     });
    // });
    //
    // it("Promise is an object or function with a then method whose behavior conforms to this specification", ()=>{
    //     let promise = new Promise((resolve, reject)=>{});
    //     expect(typeof promise.then).toEqual("function");
    // });
    //
    // it("Promise will call resolve function when fulfilled, and change status to resolved", (done)=>{
    //     let promise = new Promise((resolve, reject)=>{
    //         process.nextTick(()=>{
    //             resolve();
    //             expect(promise.status).toEqual(PromiseStatus.RESOLVED);
    //             done();
    //         });
    //     });
    //     expect(promise.status).toEqual(PromiseStatus.PENDING);
    // });
    //
    // it("Promise will call reject function when failed, and change status to rejected", (done)=>{
    //     let promise = new Promise((resolve, reject)=>{
    //         process.nextTick(()=>{
    //             reject();
    //             expect(promise.status).toEqual(PromiseStatus.REJECTED);
    //             done();
    //         });
    //     });
    //     expect(promise.status).toEqual(PromiseStatus.PENDING);
    // });
    //
    // it("Promise will not change status after complete(reject)", (done)=>{
    //     let promise = new Promise((resolve, reject)=>{
    //         process.nextTick(()=>{
    //             reject();
    //             resolve();
    //             expect(promise.status).toEqual(PromiseStatus.REJECTED);
    //             done();
    //         });
    //     });
    // });
    //
    // it("Promise will not change status after complete(resolve)", (done)=>{
    //     let promise = new Promise((resolve, reject)=>{
    //         process.nextTick(()=>{
    //             resolve();
    //             reject();
    //             expect(promise.status).toEqual(PromiseStatus.RESOLVED);
    //             done();
    //         });
    //     });
    // });
});

describe("The Then Method", ()=>{
    // involved inner process, hard to check from outside
    // it("onFulfilled has to be called after promise resolved", ()=>{});

    it("then must return a promise", ()=>{
        const promise1 = new Promise();
        const promise2 = promise1.then((result)=>{});
        // redundant check: discovered by ts
        // expect(promise2 instanceof Promise).toBe(true);
        expect(promise1 === promise2).toBe(false);
    });

    // 2.2.6 then may be called multiple times on the same promise.
    // 2.2.6.1
    it("If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then", ()=>{
        let executedOrder = "";
        const promise1 = new Promise((resolve, reject)=>{
            resolve(1);
        });
        const helpFunc = (order: string)=>{
           return (result)=>{
            executedOrder += (order + result);
           }
        };
        promise1.then(helpFunc("A"));
        promise1.then(helpFunc("B"));
        promise1.then(helpFunc("C"));

        // also check if the result pass to then method
        expect(executedOrder).toBe("A1B1C1");
    });

    // 2.2.6.2
    it("If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.", ()=>{
        let executedOrder = "";
        const promise1 = new Promise((resolve, reject)=>{
            reject(1);
        });
        const helpFunc = (order: string)=>{
            return (reason)=>{
                executedOrder += (order + reason);
            }
        };
        promise1.then(undefined, helpFunc("A"));
        promise1.then(undefined, helpFunc("B"));
        promise1.then(undefined, helpFunc("C"));

        // also check if the result pass to then method
        expect(executedOrder).toBe("A1B1C1");
    });

    // 2.2.7
    it("then must return a new promise", ()=>{
        const promise1 = new Promise((resolve, reject)=>{
            resolve(1);
        });
        const promise2 = promise1.then((result)=>{
            expect(result).toBe(1);
        });
        expect(promise1 === promise2).toBe(false);
    });

    it("If executor throws an exception e, next promise must be rejected with e as the reason.", ()=>{
        let tmpReason;
        const promise1 = new Promise((resolve, reject)=>{
            throw new Error("GG");
        }).then(undefined, (reason)=>{
            tmpReason = reason;
        });

        // because try catch, the assert of jest will be blocked, so I check result at next tick
        process.nextTick(()=>{
            expect(tmpReason.toString()).toBe("Error: GG");
        })
    });

    // 2.2.7.2
    it("If onFulfilled throws an exception e, next promise must be rejected with e as the reason.", ()=>{
        let tmpReason;
        const promise1 = new Promise((resolve, reject)=>{
            resolve();
        }).then((result)=>{
            throw new Error("GG");
        }).then(undefined, (reason)=>{
            tmpReason = reason;
        });

        // because try catch, the assert of jest will be blocked, so I check result at next tick
        process.nextTick(()=>{
            expect(tmpReason.toString()).toBe("Error: GG");
        })
    });

    it("If onFailed throws an exception e, next promise must be rejected with e as the reason.", ()=>{
        let tmpReason;
        const promise1 = new Promise((resolve, reject)=>{
            reject();
        }).then(undefined, (reason)=>{
            throw new Error("GG");
        }).then(undefined, (reason)=>{
            tmpReason = reason;
        });

        // because try catch, the assert of jest will be blocked, so I check result at next tick
        process.nextTick(()=>{
            expect(tmpReason.toString()).toBe("Error: GG");
        })
    });

    // 2.2.7.3
    it("If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1", ()=>{
        let tmpResult;
        const promise1 = new Promise((resolve, reject)=>{
            resolve(1);
        }).then()
            .then((result)=>{
                tmpResult = result;
            });

        process.nextTick(()=>{
            expect(tmpResult).toBe(1);
        });
    });

    // 2.2.7.4
    it("If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.", ()=>{
        let tmpReason;
        const promise1 = new Promise((resolve, reject)=>{
            reject(1);
        }).then()
            .then(undefined, (reason)=>{
                tmpReason = reason;
            });

        process.nextTick(()=>{
            expect(tmpReason).toBe(1);
        });
    });
});
