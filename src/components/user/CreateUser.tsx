
import { useEffect, useState } from 'react';
import Button from '../shared/button/Button';
import {MessageDialog } from '../messagebox/MessageBox';
import './CreateUser.css';
import User from '../../entities/user/User';
import {useLocation, useNavigate} from 'react-router-dom'
import { useGlobalContext } from '../../global/GlobalContext';
import { API } from '../../api/API';

export default function EditProduct()
{

    let navigation = useNavigate();

    let user : User | undefined =useLocation().state as (User | undefined); 

    let editing : boolean = user != undefined && user.Id != "";    

    let [editingUser, setUser] = useState<User | undefined>(!editing ? new User("", "", "","", "").SetActive(true) : user);

  
    let context = useGlobalContext();

    useEffect(()=>{       
       
        if(context && context.Data && context.Data.CheckLogin)
            context!.Data!.CheckLogin!();   
                              
        if(editingUser && editingUser.Id && !editingUser?.IsSuperUser())
        {
            let clone = Reflect.construct(User, []);
            Object.assign(clone, context?.Data?.CurrentUser);
            setUser(clone);
        }
        
    }, []);
            
    let ShowConfirm = (action: ()=> void) =>
    {
        MessageDialog.Show({
            IsOpen: true, 
            Message: "Salvar usuario?",
            OKText: "Salvar",
            Title: "Atenção",
            OKClickEvent : ()=> action(), 
            Canceltext: "Cancelar", 
            CancelEvent: ()=>{}
    
        });
    }

    let Toast = (title: string, message: string, action?: ()=> void) =>
    {
        MessageDialog.Toast(title, message, action);
    }
                  

    let SalvarClick = () =>
    {   
        let user = editingUser!;

        if(!user.Name)
        {
            Toast("Atenção", "Informe o nome do usuario");
            return;
        }

        if(!user.Name)
        {
            Toast("Atenção", "Informe o login do usuario");
            return;
        }

        if(!user.Password)
        {
            Toast("Atenção", "Informe a senha do usuario");
            return;
        }      

        ShowConfirm(SalvarUser);  
    }
   
    let SalvarUser = async () => {        

        let postResult = await API.RequestAsync(`/user/${editing ? "update" : "create"}`, context?.Data?.Token ?? "", editing ? 'PUT' : 'POST', editingUser);
            
            
        if(!postResult.ok)        
            Toast("Erro", await postResult.text());   
        else
        {
            let id = editing? user?.Id : (await postResult.json()).Id;

            let uploadImage = await SalvarImagem(id);

            if(uploadImage)
                Toast("Sucesso", `Usuario ${editing ? "alterado" : "incluido"} na base de dados`, ()=>
                { 
                    if(context?.Data?.CurrentUser?.IsSuperUser())
                    {                        
                        navigation('/users');                        
                    }
                    else 
                        navigation('/');   

                    
                });           
        }    
        
    };

    let SalvarImagem = async (productId : string) : Promise<boolean> =>
    {
        let files = (document.getElementById("imagem-user") as any).files as Array<Blob>;

        if(files.length == 0)
            return true;

        let data = new FormData();        
        data.append('image', files[0]);

        let responseUpload = await API.RequestAsync(`/user/set-image?userId=${productId}`, context?.Data?.Token ?? "", 'POST', data );       

        if(!responseUpload.ok)
        {
            Toast("Erro", await responseUpload.text());
            return false;
        }

        return true;
        
    }

    let SelecionarArquivo = ()=>
    {
         (document.getElementById("imagem-user") as any).click();
    }

    let ArquivoSelecionado = () => 
    {
        if((document.getElementById("imagem-user") as any).files.lenght == 0)
            return;

        let fileReader = new FileReader();

        fileReader.onload = function(e)
        {
            (document.getElementById('img-user') as any).src = e.target?.result;
        }

        fileReader.readAsDataURL((document.getElementById("imagem-user") as any).files[0]);
    }

    let ValueChange = () => 
    {        
        let nome = (document.getElementById("nome-user-create") as any).value;
        let login = (document.getElementById("login-user-create") as any).value;
        let senha = (document.getElementById("senha-user-create") as any).value;
        let departamento = (document.getElementById("departamento-user") as any).value;
        let status = (document.getElementById("status-user") as any).value == 1;
        let saldo = (document.getElementById("saldo-user") as any).value;

        if(!context?.Data?.CurrentUserIsSuperUser())
        {
            saldo = editingUser?.Balance;
            login = editingUser?.Login;
            status = editingUser?.Active ?? true;
            departamento = editingUser?.Departament;
        }
       
        setUser(new User(editing ? user!.Id : "", nome, login, senha, departamento).SetActive(status).SetBalance(saldo));  

    }

    return(

        <div className="CreateUser">
            <input type='file' id='imagem-user' hidden onChange={()=> ArquivoSelecionado()}/>
            <img className='UserImage' id="img-user" src={editing? 
                `${API.URL}/user/static/get-image?userId=${user?.Id}`: 
                `${API.URL}/user/static/get-default-image`} onClick={()=> SelecionarArquivo()}/>
             <>
            <code>Login</code>
            <input id="login-user-create" type='text' maxLength={3} placeholder='login do usuario' value={editingUser?.Login} onChange={()=>{ValueChange()}} 
            disabled={!context?.Data?.CurrentUser?.IsSuperUser()}/>
            </>
            <>
            <code>Nome</code>
            <input id="nome-user-create" type='text' placeholder='Nome do usuario' value={editingUser?.Name} onChange={()=>{ValueChange()}}/>
            </>
            <>
            <code>Senha</code>
            <input id="senha-user-create" type='password' placeholder='Senha do usuario' value={editingUser?.Password} onChange={()=>{ValueChange()}}/>
            </>
            <>
            <code>Departamento</code>
                <select id="departamento-user" onChange={()=>{ValueChange()}} defaultValue={editingUser?.Departament ? editingUser.Departament : "Sem departamento definido"} disabled={!context?.Data?.CurrentUser?.IsSuperUser()}>
                    {
                        ["Desenvolvimento", "Suporte", "Implantação", "Recursos humanos", "Comercial", "Sem departamento definido"].Select(s => 
                            (
                                <option key={s} value={s}>{s}</option>
                            ))
                    }
                    
                </select>
            </>
            <>
            <code>Status</code>
                <select id="status-user" onChange={()=>{ValueChange()}} defaultChecked={editingUser?.Active} disabled={!context?.Data?.CurrentUser?.IsSuperUser()}>
                    <option value={1}>Ativo</option>
                    <option value={0}>Desativado</option>
                </select>
            </>
            <>
            <code>Saldo</code>
            <input id="saldo-user" type='number' placeholder='Saldo do usuario' value={editingUser?.Balance} onChange={()=>{ValueChange()}} disabled={!context?.Data?.CurrentUser?.IsSuperUser()}/>
            </>
            <hr/>
            <div className='ButtonsContainer'>
                <Button Text='Cancelar' Type='Cancel' OnClickEventHandler={()=>{ context?.Data?.CurrentUserIsSuperUser()? navigation('/users') : navigation('/products')}}/>
                <Button Text='Salvar' Type='Save' OnClickEventHandler={SalvarClick}/>
            </div>
        </div>
    );
}