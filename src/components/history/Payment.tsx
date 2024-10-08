import { useEffect } from 'react';
import { useGlobalContext } from '../../global/GlobalContext';
import './Payment.css';
import Button from '../shared/button/Button';
import { useNavigate } from 'react-router-dom';
import { MessageDialog } from '../messagebox/MessageBox';




export default function Payment()
{
    let context = useGlobalContext();

    let saldo = context?.Data?.CurrentUser?.Balance;

    useEffect(()=>{       
        if(context && context.Data && context.Data.CheckLogin)
            context!.Data!.CheckLogin!();          
    }, []);

    let selecionarArquivo = () =>
    {
        document.getElementById('image-payment')!.click();       
    }

    let carregarArquivo = () =>
    {
        
        let element = document.getElementById('image-payment') as any;   
        
        if(element.files.length == 0)
            return;

        let reader = new FileReader();

        reader.onload = function(evt)
        {
            (document.getElementById('image-carregada-payment') as any).src = evt.target?.result;
        }
        reader.readAsDataURL(element.files[0]);

    }

    let pagarSaldo = async () =>
    {
        let data : {UserId : string} = 
        {
            UserId :  context?.Data?.CurrentUser?.Id!
        }

        let pagarResponse = await fetch('http://192.168.15.144:60000/order/pay-order', 
        {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            }, 
            body : JSON.stringify(data)
        });

        if(!pagarResponse.ok)
        {
            MessageDialog.Toast("Erro ao realizar pagamento", await pagarResponse.text());
            return;
        }

        let id = (await pagarResponse.json()).Id;

        if(!(await salvarImagem(id)))
            return;
        else
        {
            MessageDialog.Toast("Pagamento", "Pagamento realizado");
            context?.Data?.Navigate!('/products', []);
            context?.Data?.UpdateCurrentUser!();
        }


    } 

    let pagarClick = () =>
    {
        let element = document.getElementById('image-payment') as any;   
        
        if(element.files.length == 0)
        {
            MessageDialog.Toast("Atenção", "Selecione o comprovante de pagamento");
            return;
        }

        MessageDialog.Show({

            IsOpen: true,
            Title: "Confirmação de pagamento",
            Message: `Confirma o pagamento do valor de R$ ${context!.Data!.CurrentUser!.Balance.toFixed(2).toString().replace('.',',')}`,
            OKText: "Confirmar", 
            OKClickEvent : ()=> pagarSaldo(),
            Canceltext: "Cancelar", 
            CancelEvent: ()=>{}
        });
    }

    let salvarImagem = async (paymentId : string) : Promise<boolean> =>
    {
        let files = (document.getElementById("image-payment") as any).files as Array<Blob>;

        if(files.length == 0)
            return true;

        let data = new FormData();        
        data.append('image', files[0]);

        let responseUpload = await fetch(`http://192.168.15.144:60000/order/set-image?paymentId=${paymentId}`, 
        {
            method: 'POST', 
            body: data
        });

        if(!responseUpload.ok)
        {
            MessageDialog.Toast("Erro", await responseUpload.text());
            return false;
        }

        return true;
        
    }
    



    return(
        <div className="Payment">
          
           <div className='Container'>
            <input type='file' id="image-payment" onChange={()=>carregarArquivo()} hidden />
            <img className="Image" id="image-carregada-payment" src="http://192.168.15.144:60000/product/get-default-image" onClick={()=>selecionarArquivo()} />           
           </div>
           <div className='Container'>
                <p>Saldo: <code>R$ {saldo?.toFixed(2).toString().replace('.', ',')}</code></p>
           </div>
           <div className='ButtonContainer'>
                <Button Text='Cancelar' Type='Save' OnClickEventHandler={()=>{context!.Data?.Navigate!('/products', [])}}/>
                <Button Text='Pagar' Type='Save' OnClickEventHandler={()=>{pagarClick()}}/>
           </div>
           
        </div>
    )
}