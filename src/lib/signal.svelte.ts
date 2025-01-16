

type sinais = "openFailed" | "openStatistics" | "openNovaConversa" | "openChats" |""

export class Signal{

    state = $state<{data:any,signal:sinais}>({
        data:{},
        signal:""
    })

    reset(){
        this.state = {
            data:{},
            signal:""
        }
    }
    send(signal:sinais,data?:any){
        this.state={
            signal,
            data:data
        }
    }
}

const signal = new Signal();
export default signal