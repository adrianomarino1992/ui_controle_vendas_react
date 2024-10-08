import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../global/GlobalContext';
import './HistoryList.css';
import { MessageDialog } from '../messagebox/MessageBox';
import { History } from '../../entities/history/History';
import HistoryItemCard from './HistoryItemCard';

export default function HistoryList()
{
    let context = useGlobalContext();

    let [histories, setData] = useState<History[]>([]);

    useEffect(()=>{       
        if(context && context.Data && context.Data.CheckLogin)
            context!.Data!.CheckLogin!();   
        
        (async ()=>{

            let historyResponse = await fetch(`http://192.168.15.144:60000/order/history-by-user?userId=${context?.Data?.CurrentUser?.Id}`);

            if(!historyResponse.ok)
            {
                MessageDialog.Toast("Erro ao obter historico do usuario", await historyResponse.text());
                return;
            }
            
            let data = await historyResponse.json();
            
            setData(data);

        })();


    }, []);

    
    return(

        <div className='HistoryList'>
           {(!histories || !histories.Any()) && <p>Nenhum registro encontrado</p>}
           {histories && histories.Select(s => (<HistoryItemCard key={s.Id} histories={s} />))}
        </div>
    );
}