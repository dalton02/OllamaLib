// place files you want to import through the `$lib` alias in this folder.
export interface Chat {
    id: number;
    uuid: string;
    criadoEm: Date;
    atualizadoEm: Date;
    nome: string;
    mensagens: Mensagem[];
    thinking:boolean;
  }
  
  export interface Mensagem {
    id: number;
    conteudo: string;
    bot: boolean;
    modelo: string;
    criadoEm: Date;
    atualizadoEm: Date;
    idChat: number;
    eval_count?:string;
    eval_duration?: string;
    load_duration?: string;
    prompt_eval_count?: string;
    prompt_eval_duration?: string;
    total_duration?: string;    
    arquivos?:{
      nome:string
      url:string
    }[];

  }
  
  export type FileData = {
    content:string,
    name:string,
    mime:string,
}
