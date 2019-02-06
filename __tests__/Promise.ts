import {PromiseStatus} from "../src/PromiseStatus";
import {Promise} from "../src/Promise";

describe("1. Basic Test", ()=>{
    it("Promise have a status of pending at the beginning", ()=>{
        let promise = new Promise((resolve, reject)=>{
        });
        expect(promise.status).toEqual(PromiseStatus.PENDING);
    });
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

    it("then must return a new promise", ()=>{
        const promise1 = new Promise((resolve, reject)=>{
            resolve(1);
        });
        const promise2 = promise1.then((result)=>{
            expect(result).toBe(1);
        });
        expect(promise1 === promise2).toBe(false);
    });

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
});
