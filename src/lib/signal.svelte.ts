export class Signal{

    state = $state<{data:any,signal:string}>({
        data:{},
        signal:""
    })

    reset(){
        this.state = {
            data:{},
            signal:""
        }
    }
    send(signal:string,data?:any){
        this.state={
            signal,
            data:data
        }
    }
}

const signal = new Signal();
export default signal