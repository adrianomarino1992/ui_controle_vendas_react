import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../global/GlobalContext';
import './HistoryList.css';
import { MessageDialog } from '../messagebox/MessageBox';
import { History } from '../../entities/history/History';
import HistoryItemCard from './HistoryItemCard';
import { API } from '../../api/API';
import User from '../../entities/user/User';

export default function HistoryList()
{
    let context = useGlobalContext();

    let [histories, setData] = useState<History[]>([]);
    let [users, setUsers] = useState<User[]>([]);
    let [showResult, setShowResult] = useState(false);
    let isSuperUser = context?.Data?.CurrentUserIsSuperUser() ?? false;

    useEffect(()=>{   

        if(context && context.Data && context.Data.CheckLogin)
            context!.Data!.CheckLogin!();   
        
        (async ()=>{

            if(!isSuperUser)
                await getHistoryOfUser(context?.Data?.CurrentUser?.Id!);
            else
            {
                let getUsersTaskResult = await API.RequestAsync('/user/list-all', context?.Data?.Token ?? "", 'GET');

                if(!getUsersTaskResult.ok)
                {
                    MessageDialog.Toast("Erro", "Erro ao obter os usuarios do servidor");   
                    return;
                }

                let usersJson = await getUsersTaskResult.json();

                let users : User[] = [];

                for(let u of usersJson)
                {
                    let user = Reflect.construct(User, []);
                    Object.assign(user, u);
                    users.Add(user);
                }               

                setUsers(users);                
            }

        })();


    }, []);

    let getHistoryOfUser = async (userId : string) =>
    {
        let historyResponse = await API.RequestAsync(`/order/history-by-user?userId=${userId}`, context?.Data?.Token ?? "", 'GET');
        setShowResult(true);
        if(!historyResponse.ok)
        {
            MessageDialog.Toast("Erro ao obter historico do usuario", await historyResponse.text());
            return;
        }
        
        let data = await historyResponse.json();
        
        setData(data);
    }

    let onSelecteUser = async () => 
    {
        let user = (document.getElementById('select-user-history') as any).value;

        if(user== '#')
            return;
       
        await getHistoryOfUser(user);
    } 
    
    return(

        <div className='HistoryList'>
           {isSuperUser && (
            <>           
            <select id="select-user-history" defaultValue="#" onChange={()=> onSelecteUser()}>
                <option value="#" disabled>Selecione um usuario</option>
                {users && users.Select(s => (
                    <option value={s.Id}>{s.Name}</option>
                ))}
            </select>
            <br/>
            </>
           )}
           {(!isSuperUser || showResult) && (!histories || !histories.Any()) && <p>Nenhum registro encontrado</p>}
           {histories && histories.Select(s => (<HistoryItemCard key={s.Id} histories={s} />))}
        </div>
    );
}