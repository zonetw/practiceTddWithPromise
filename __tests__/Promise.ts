import {PromiseStatus} from "../src/PromiseStatus";
import {Promise} from "../src/Promise";

describe("1. Basic Test", ()=>{
    it("Promise have a status of pending at the beginning", ()=>{
        let promise = new Promise((resolve, reject)=>{
        });
        expect(promise.status).toEqual(PromiseStatus.PENDING);
    });
});