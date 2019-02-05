import {PromiseStatus} from "./PromiseStatus";

export class Promise{
    get status(): PromiseStatus {
        return this._status;
    }
    private _status: PromiseStatus;

    constructor(executor: (resolve:(result)=>void, reject:(reason)=>void)=>void){
        this._status = PromiseStatus.PENDING;
    }
}