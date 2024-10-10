import React, { useEffect, useState } from 'react';
import Button from '../shared/button/Button';
import './Login.css';
import logo from './logo.jpg';
import User from '../../entities/user/User';
import { MessageDialog } from '../messagebox/MessageBox';
import { useGlobalContext } from '../../global/GlobalContext';
import { API } from '../../api/API';


export default function Login()
{
    let context = useGlobalContext();    
     
    let [currentUser, setUser] = useState<User>(new User("", "", "", "", ""));

    useEffect(()=>{

        let contextUser = context?.Data?.CurrentUser ?? new User("", "", "", "", "");    

        setUser(contextUser);

    }, [])
    
    let visible: React.CSSProperties = currentUser.Id ? {display: 'none'} : {display : 'flex'};

    let tryLogin = async () =>
    {

        let login = (document.getElementById('login-user') as any).value;
        let password = (document.getElementById('senha-user') as any).value;       
      
        
        if(!login)
        {
            MessageDialog.Toast("Atenção", "Informe o login");
            return;
        }

        if(!password)
        {
            MessageDialog.Toast("Atenção", "Informe a senha");
            return;
        }

        (document.getElementById('login-user') as any).value = '';
        (document.getElementById('senha-user') as any).value = '';
        
        await loginRequest(login, password);

        context!.Data!.Navigate!('/', []);
    };

    let loginRequest = async (login : string, password : string) =>
    {
        let loginResponse = await API.RequestAsync(`/user/login?username=${login}&password=${password}`, '', 'GET');

        if(!loginResponse.ok)
        {
            MessageDialog.Toast("Login", "Usuario e/ou senha invalidos");
            return;
        }

        let responseJson = await loginResponse.json() as any;

        let userResponse = responseJson.User;

        userResponse.__proto__ = User.prototype;
        
        setUser(userResponse);

        context?.SetData(
            {...context.Data, CurrentUser: userResponse, 
                Token : responseJson.Token,
                GetCurrentUser : () => {                    
                    return userResponse;
                },
                CheckLogin: ()=>{}, 
                UpdateCurrentUser: async()=>
                {
                    await loginRequest(userResponse.Login, userResponse.Password);
                },
                CurrentUserIsSuperUser: ()=>{

                    if(userResponse.IsSuperUser())
                        return true;

                    return false;
                }
            });  

        context!.Data!.UpdateStatusBarHandler!({Username: userResponse.Name, BalanceString: `Aberto: R$ ${userResponse.Balance.toFixed(2).replace('.', ',')}`});
               
        context?.Data?.OnLogin?.forEach(v => v(userResponse));    

    }

    return(
        <div className="LoginContainer" style={visible}>
            <div className='Login'>
           
                <img src={logo}/>
                <>
                <code>Login</code>
                <input id="login-user" type='text' maxLength={3} placeholder='login do usuario'/>
                </>                
                <>
                <code>Senha</code>
                <input id="senha-user" type='password' placeholder='Senha do usuario'/>
                </>
                <hr/>
                <>
                    <Button Text='Entrar' OnClickEventHandler={()=>{tryLogin()}} Type='Save'/>
                </>           
            </div>

        </div>
    )
}