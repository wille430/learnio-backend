export default class InputError {
    location: string
    msg: string
    param: string

    constructor({
        location,
        msg,
        param
    }) {
        this.location = location
        this.msg = msg
        this.param = param
    }
}