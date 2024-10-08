
import { useEffect, useState } from 'react';
import Button from '../shared/button/Button';
import {MessageDialog } from '../messagebox/MessageBox';
import './CreateUser.css';
import User from '../../entities/user/User';
import {useLocation} from 'react-router-dom'
import { useGlobalContext } from '../../global/GlobalContext';

export default function EditProduct()
{

    let user : User | undefined =useLocation().state as (User | undefined);
    
    let editing : boolean = user != undefined && user.Id != "";    

    let [editingUser, setUser] = useState<User | undefined>(!editing ? new User("", "", "","", "").SetActive(true) : user);

    let context = useGlobalContext();

    useEffect(()=>{       
        if(context && context.Data && context.Data.CheckLogin)
            context!.Data!.CheckLogin!();          
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
              

    let Getuser = ()=>
    {
        let nome = (document.getElementById("nome-user") as any).value;
        let login = (document.getElementById("login-user") as any).value;
        let senha = (document.getElementById("senha-user") as any).value;
        let departamento = (document.getElementById("departamento-user") as any).value;
        let status = (document.getElementById("status-user") as any).value == 1;
        let saldo = (document.getElementById("saldo-user") as any).value;

        return new User(editing ? user!.Id : "", nome, login, senha, departamento).SetActive(status).SetBalance(saldo);
    }

    

    let SalvarClick = () =>
    {   
        let user = Getuser();

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

        let postResult = await fetch(`http://192.168.15.144:60000/user/${editing ? "update" : "create"}`, 
            {
                method: editing ? 'PUT' : 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                  },
                body: JSON.stringify(Getuser())
            });
            
        if(!postResult.ok)        
            Toast("Erro", await postResult.text());   
        else
        {
            let id = editing? user?.Id : (await postResult.json()).Id;

            let uploadImage = await SalvarImagem(id);

            if(uploadImage)
                Toast("Sucesso", `Usuario ${editing ? "alterado" : "incluido"} na base de dados`, ()=>{window.location.href = "http://192.168.15.144:3000/users"});           
        }    
        
    };

    let SalvarImagem = async (productId : string) : Promise<boolean> =>
    {
        let files = (document.getElementById("imagem-user") as any).files as Array<Blob>;

        if(files.length == 0)
            return true;

        let data = new FormData();        
        data.append('image', files[0]);

        let responseUpload = await fetch(`http://192.168.15.144:60000/user/set-image?userId=${productId}`, 
        {
            method: 'POST', 
            body: data
        });

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
        let nome = (document.getElementById("nome-user") as any).value;
        let login = (document.getElementById("login-user") as any).value;
        let senha = (document.getElementById("senha-user") as any).value;
        let departamento = (document.getElementById("departamento-user") as any).value;
        let status = (document.getElementById("status-user") as any).value == 1;
        let saldo = (document.getElementById("saldo-user") as any).value;

        setUser(new User(editing ? user!.Id : "", nome, login, senha, departamento).SetActive(status).SetBalance(saldo));  

    }

    return(

        <div className="CreateUser">
            <input type='file' id='imagem-user' hidden onChange={()=> ArquivoSelecionado()}/>
            <img className='UserImage' id="img-user" src={editing? 
                `http://192.168.15.144:60000/user/get-image?userId=${user?.Id}`: 
                `http://192.168.15.144:60000/user/get-default-image`} onClick={()=> SelecionarArquivo()}/>
             <>
            <code>Login</code>
            <input id="login-user" type='text' maxLength={3} placeholder='login do usuario' value={editingUser?.Login} onChange={()=>{ValueChange()}}/>
            </>
            <>
            <code>Nome</code>
            <input id="nome-user" type='text' placeholder='Nome do usuario' value={editingUser?.Name} onChange={()=>{ValueChange()}}/>
            </>
            <>
            <code>Senha</code>
            <input id="senha-user" type='password' placeholder='Senha do usuario' value={editingUser?.Password} onChange={()=>{ValueChange()}}/>
            </>
            <>
            <code>Departamento</code>
                <select id="departamento-user" onChange={()=>{ValueChange()}} defaultValue={editingUser?.Departament}>
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
                <select id="status-user" onChange={()=>{ValueChange()}} defaultChecked={editingUser?.Active}>
                    <option value={1}>Ativo</option>
                    <option value={0}>Desativado</option>
                </select>
            </>
            <>
            <code>Saldo</code>
            <input id="saldo-user" type='number' placeholder='Saldo do usuario' value={editingUser?.Balance} onChange={()=>{ValueChange()}}/>
            </>
            <hr/>
            <div className='ButtonsContainer'>
                <Button Text='Cancelar' Type='Cancel' OnClickEventHandler={()=>{ window.location.href="/users"}}/>
                <Button Text='Salvar' Type='Save' OnClickEventHandler={SalvarClick}/>
            </div>
        </div>
    );
}