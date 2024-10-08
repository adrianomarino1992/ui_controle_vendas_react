import './ListUsers.css';
import User from '../../entities/user/User';
import { useEffect, useState } from 'react';
import { MessageDialog } from '../messagebox/MessageBox';
import UserCard from './UserCard';
import { useGlobalContext } from '../../global/GlobalContext';


export default function ListUsers()
{
    let [users, setUsers] = useState<User[]>([]);

    let context = useGlobalContext();

    useEffect(()=>{       
        if(context && context.Data && context.Data.CheckLogin)
            context!.Data!.CheckLogin!();          
    }, []);
    
    useEffect(()=>{

        (async () =>{
            
            let getUsersTaskResult = await fetch('http://192.168.15.144:60000/user/list-all');

            if(!getUsersTaskResult.ok)
            {
                MessageDialog.Toast("Erro", "Erro ao obter os usuarios do servidor");   
                return;
            }

            let users = await getUsersTaskResult.json() as User[];

            users.Add(new User("", "Adicione um novo usuario", "Novo", "", ""));

            setUsers(users);
            
        })();

    });

    return(
        <div className='ListUsersContainer'>           
            
            <div className='ListUsers'> 

                {users && users.Select(s => 
                (
                    <UserCard key={s.Id} user={s}/>
                ))}

            </div>
            
        </div>
    )
}