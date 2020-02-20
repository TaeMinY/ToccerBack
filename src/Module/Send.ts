function Send(res, status:number, mes?:string, result?: boolean, data?:any) {
    res.status(status).send({result,mes,data}).end();
}
export default Send;