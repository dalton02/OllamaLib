import { consoleDev } from "../utils";

/**
 * Classe para sanitização e formatação de diversos tipos de documentos e números de telefone.
 */
class Sanitizer {


    /**
     * Formata uma data no formato DD/MM/AAAA.
     * @param inputDate - A data a ser formatada, como uma string no formato AAAAMMDD ou AAAA-MM-DD.
     * @returns A data formatada no estilo DD/MM/AAAA.
     */
    data(inputDate: string): string {
        // Remove quaisquer caracteres que não sejam números
        inputDate = inputDate.replace(/\D/g, '');
        inputDate = inputDate.substring(0, 8);

        if (inputDate.length==3) { //Retorna dia/
            inputDate = inputDate.replace(/(\d{2})/, '$1/');
        }
        else if (inputDate.length == 5 || inputDate.length==6) { //Retorna dia/
            inputDate = inputDate.replace(/(\d{2})(\d{2})/, '$1/$2/');
        }
        else if (inputDate.length <= 8) { // Retorna dia/mês/ano
            inputDate = inputDate.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
        }
        
        return inputDate
    }

    numero(input:string,limite?:number,minimo?:number):string{
        
        input = input.replace(/[^0-9]/g, '');

        if(parseInt(input,10) >= limite){
            input = limite.toString();
        }
        
        if( (minimo && parseInt(input,10)<=minimo)  ){
            input = minimo.toString();
        }

        return input;

    }

    /**
     * Formata um número de CPF.
     * @param cpf - O número de CPF a ser formatado, como uma string.
     * @returns O número de CPF formatado.
     */
    cpf(cpf: string): string {
        if(cpf.length > 14) {
            return cpf.substring(0, 14);
        }
        let doc = cpf.replace(/[^0-9]/g, '');
        if (doc.length <= 11) {
            doc = doc.replace(/(\d{3})(\d)/, '$1.$2');
            doc = doc.replace(/(\d{3})(\d)/, '$1.$2');
            doc = doc.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return doc;
    }

    /**
     * Formata um número de CPF ou CNPJ dependendo da quantidade de dígitos.
     * @param cpf - O número do documento a ser formatado, como uma string.
     * @returns O número do documento formatado.
     */
    cpfcnpj(cpf: string): string {
        let doc = cpf.replace(/[^0-9]/g, '');
        if (doc.length > 14) {
            doc = doc.substring(0, 14);
        }
        if (doc.length <= 11) {
            doc = doc.replace(/(\d{3})(\d)/, '$1.$2');
            doc = doc.replace(/(\d{3})(\d)/, '$1.$2');
            doc = doc.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else if (doc.length <= 14) {
            doc = doc.replace(/^(\d{2})(\d)/, '$1.$2');
            doc = doc.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            doc = doc.replace(/\.(\d{3})(\d)/, '.$1/$2');
            doc = doc.replace(/(\d{4})(\d)/, '$1-$2');
        }
        return doc;
    }

    /**
     * Formata um número de CNPJ.
     * @param inputValue - O número de CNPJ a ser formatado, como uma string.
     * @returns O número de CNPJ formatado.
     */
    cnpj(inputValue: string): string {
        inputValue = inputValue.replace(/\D/g, '');

        if (inputValue.length > 14) {
            inputValue = inputValue.slice(0, 14);
        }
        if (inputValue.length > 2) {
            inputValue = inputValue.replace(/^(\d{2})(\d)/, '$1.$2');
        }
        if (inputValue.length > 5) {
            inputValue = inputValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        }
        if (inputValue.length > 8) {
            inputValue = inputValue.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
        }
        if (inputValue.length > 12) {
            inputValue = inputValue.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
        }

        return inputValue;
    }

    /**
     * Formata um número de RG (Registro Geral).
     * @param inputValue - O número de RG a ser formatado, como uma string.
     * @returns O número de RG formatado.
     */
    rg(inputValue: string): string {
        inputValue = inputValue.replace(/\D/g, '');

        if (inputValue.length > 10) {
            inputValue = inputValue.slice(0, 10);
        }

        if (inputValue.length > 9) {
            inputValue = inputValue.replace(/^(\d{10})(\d)/, '$1-$2');
        }

        return inputValue;
    }
        /**
     * Formata um número de inscrição estadual.
     * @param ie - O número de inscrição estadual a ser formatado, como uma string.
     * @returns O número de inscrição estadual formatado.
     */
    inscricaoEstadual(ie: string): string {
        ie = ie.replace(/\D/g, '');  // Remove todos os caracteres não numéricos

        // Limita a inscrição estadual a 14 dígitos (máximo observado em alguns estados)
        if (ie.length > 14) {
            ie = ie.substring(0, 14);
        }

        // Formata conforme o número de dígitos. A formatação pode variar por estado.
        // Por exemplo, aqui usaremos um padrão básico de agrupamento.
        if (ie.length <= 9) {
            ie = ie.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
        } else if (ie.length <= 12) {
            ie = ie.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.$4');
        } else {
            ie = ie.replace(/(\d{3})(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3.$4-$5');
        }

        return ie;
    }

    /**
     * Formata um número de telefone.
     * @param input - O número de telefone a ser formatado, como uma string.
     * @param countryCode - Um booleano indicando se deve incluir o código do país na formatação.
     * @returns O número de telefone formatado.
     */
    telefone(input: string, countryCode: boolean = false): string {
        input = input.replace(/[^0-9]/g, '');
        let telefone = input.replace(/\D/g, '');

        telefone = telefone.substring(0, countryCode ? 13 : 11);
        if (telefone.length === 11) {
            telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (telefone.length === 10) {
            telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (telefone.length === 13 && countryCode) {
            telefone = telefone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
        } else {
            return input;
        }
        return telefone;
    }
    /**
     * Formata um número de telefone fixo.
     * @param input - O número de telefone a ser formatado, como uma string.
     * @param countryCode - Um booleano indicando se deve incluir o código do país na formatação.
     * @returns O número de telefone formatado.
     */
    telefoneFixo(input: string, countryCode: boolean = false): string {
        input = input.replace(/[^0-9]/g, '');
        let telefone = input.replace(/\D/g, '');

        telefone = telefone.substring(0, countryCode ? 13 : 10);
        if (telefone.length === 10) {
            telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (telefone.length === 13 && countryCode) {
            telefone = telefone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
        } else {
            return input;
        }
        return telefone;
    }

    email (email: string): boolean {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return regexEmail.test(email)
    }

    minimo (string: string, minimo: number): boolean {
        if (string) return string.length >= minimo
        return false
    }
    cep(input:string):string{
        input = input.replace(/\D/g, '');
        if (input.length >5) {
            return `${input.slice(0, 5)}-${input.slice(5,8)}`;
        } 
        if (input.length<5) {
            return `${input.slice(0, 5)}`;
        } 
        return input
    }
}

const sanitizar = new Sanitizer();
export default sanitizar;