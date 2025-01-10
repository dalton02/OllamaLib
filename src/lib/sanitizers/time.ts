import { format, formatDistance, formatRelative, parseISO, addDays } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

/*
Classe utilitária que lida com formatação de data
*/
class HandleDate{
    
    /**
     * Função para formatar uma data em um formato específico.
     * 
     * @param {Date} date - A data a ser formatada.
     * @param {string} [dateFormat='dd/MM/yyyy'] - O formato desejado para a data.
     * @returns {string} - A data formatada como uma string.
     */
      formatDate = (date: Date, dateFormat: string = 'dd/MM/yyyy'): string => {
        return format(new Date(date), dateFormat);
    };
    
    /**
     * Função para formatar uma data com base na distância de tempo até o presente.
     * 
     * @param {Date} date - A data a ser comparada com o presente.
     * @returns {string} - A distância de tempo até o presente, formatada como uma string.
     */
    formatDistanceToNow = (date: Date) => {
        return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: enUS });
    };
    
    /**
     * Função para formatar uma data de forma relativa (ex: "há 3 dias", "em 2 semanas").
     * 
     * @param {Date} date - A data a ser formatada de forma relativa.
     * @param {Date} [baseDate=new Date()] - A data base para calcular a distância relativa.
     * @returns {string} - A data formatada de forma relativa, como uma string.
     */
    formatRelativeDate = (date: Date, baseDate = new Date()) => {
        return formatRelative(new Date(date), baseDate, { locale: enUS });
    };
    
    dataChat(date: Date): string {
        const now = new Date();
        
        // Verifica se a data é de hoje
        const isToday = date.toDateString() === now.toDateString();
        
        // Se for de hoje, retorna "horas:minutos"
        if (isToday) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }
      
        // Verifica se a data é da mesma semana
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // começa a semana no domingo
      
        const isThisWeek = date >= startOfWeek && date < now;
      
        if (isThisWeek) {
          const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
          const dayOfWeek = daysOfWeek[date.getDay()];
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${dayOfWeek} às ${hours}:${minutes}`;
        }
      
        return this.formatDate(date);
      }
      /**
     * Função para adicionar dias a uma data.
     * 
     * @param {Date} date - A data original.
     * @param {number} days - O número de dias a serem adicionados.
     * @param {string} [dateFormat='dd/MM/yyyy'] - O formato desejado para a data resultante.
     * @returns {string} - A nova data, com os dias adicionados, formatada 
     */
    addDaysToDate = (date : Date, days : number, dateFormat : string = 'dd/MM/yyyy') => {
        return format(addDays(new Date(date), days), dateFormat);
    };

    /**
    * Função para converter uma string ISO em uma data formatada.
    * 
    * @param {string} isoDate - A string ISO a ser convertida em data.
    * @param {string} [dateFormat='dd/MM/yyyy'] - O formato desejado para a data resultante.
    * @returns {string} - A data formatada, convertida a partir da string ISO.
    */
    formatISODate = (isoDate: string, dateFormat: string = 'dd/MM/yyyy') => {
       return format(parseISO(isoDate), dateFormat);
    };
}

const handleDate = new HandleDate();
export default handleDate;