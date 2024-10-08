import React, { useEffect, useState } from 'react';
import Button from '../shared/button/Button';
import './Login.css';
import logo from './logo.jpg';
import User from '../../entities/user/User';
import { MessageDialog } from '../messagebox/MessageBox';
import { useGlobalContext } from '../../global/GlobalContext';


export default function Login()
{
    let context = useGlobalContext();    
    
    let contextUser = context?.Data?.CurrentUser ?? new User("", "", "", "", "");

   
    //contextUser = context?.Data?.CurrentUser ?? new User(User.GetDeveloperName(), User.GetDeveloperName(), "", "", "").SetBalance(9999);
    
    
    useEffect(() =>
    {
        if(contextUser && contextUser.Id)
        {
            setTimeout(()=>{
        
                context!.Data!.UpdateStatusBarHandler!({Username: contextUser.Name, BalanceString: `Aberto: R$ ${contextUser.Balance.toFixed(2).replace('.', ',')}`});
        
            }, 500);
        
            context?.SetData({...context!.Data, CurrentUser : contextUser, CheckLogin: ()=>{}, UpdateCurrentUser: async ()=>{
                await loginRequest(contextUser.Login, contextUser.Password);
            }});  
        }
               
    }, []);
     
    let [_, setUser] = useState<User>(contextUser);

    let visible: React.CSSProperties = contextUser.Id ? {display: 'none'} : {display : 'flex'};

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
        
        await loginRequest(login, password);
    };

    let loginRequest = async (login : string, password : string) =>
    {
        let loginResponse = await fetch(`http://192.168.15.144:60000/user/login?username=${login}&password=${password}`);

        if(!loginResponse.ok)
        {
            MessageDialog.Toast("Login", "Usuario e/ou senha invalidos");
            return;
        }

        let userResponse = await loginResponse.json() as User;
        
        setUser(userResponse);

        context?.SetData({...context.Data, CurrentUser: userResponse, CheckLogin: ()=>{}, UpdateCurrentUser: async()=>
        {
            await loginRequest(userResponse.Login, userResponse.Password);
        }});  

        context!.Data!.UpdateStatusBarHandler!({Username: userResponse.Name, BalanceString: `Aberto: R$ ${userResponse.Balance.toFixed(2).replace('.', ',')}`});
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