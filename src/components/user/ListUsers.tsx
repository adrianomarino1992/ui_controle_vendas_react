import './ListUsers.css';
import User from '../../entities/user/User';
import { useEffect, useState } from 'react';
import { MessageDialog } from '../messagebox/MessageBox';
import UserCard from './UserCard';
import { useGlobalContext } from '../../global/GlobalContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '../../api/API';


export default function ListUsers()
{
    let [users, setUsers] = useState<User[]>([]);
    let context = useGlobalContext();

    let navigate = useNavigate();    

    useEffect(()=>{    

        if(context && context.Data && context.Data.CheckLogin)
            context!.Data!.CheckLogin!(); 
                
        if(context && context.Data && context.Data.CurrentUser)
        {
            if(!context.Data.CurrentUserIsSuperUser())
                navigate('/user', {state: context?.Data?.CurrentUser});
        }
        

    }, []);
    
    useEffect(()=>{

        (async () =>{
            
            if(!context?.Data?.CurrentUserIsSuperUser())
                return;
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