
import { useEffect, useState } from 'react';
import Button from '../shared/button/Button';
import {MessageDialog } from '../messagebox/MessageBox';
import './CreateProduct.css';
import Product from '../../entities/product/Product';
import {useLocation, useNavigate} from 'react-router-dom'
import { useGlobalContext } from '../../global/GlobalContext';

export default function EditProduct()
{
    let navigation = useNavigate();

    let product : Product | undefined =useLocation().state as (Product | undefined);
    
    let editing : boolean = product != undefined && product.Id != "";    

    let [editingProduct, SetProduct] = useState<Product | undefined>(!editing ? new Product("", "", "", 0, 0).SetActive(true) : product);

    let context = useGlobalContext();

    useEffect(()=>{       
        if(context && context.Data && context.Data.CheckLogin)
            context!.Data!.CheckLogin!();          
    }, []);

        
    let ShowConfirm = (action: ()=> void) =>
    {
        MessageDialog.Show({
            IsOpen: true, 
            Message: "Salvar produto?",
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
              

    let GetProduto = ()=>
    {
        let nome = (document.getElementById("nome-produto") as any).value;
        let descricao = (document.getElementById("descricao-produto") as any).value;
        let preco = (document.getElementById("preco-produto") as any).value;
        let estoque = (document.getElementById("estoque-produto") as any).value;
        let status = (document.getElementById("status-produto") as any).value == 1;

        return new Product(editing ? product!.Id : "", descricao, nome, Number.parseFloat(preco), Number.parseInt(estoque)).SetActive(status);
    }

    

    let SalvarClick = () =>
    {   
        let produto = GetProduto();

        if(!produto.Name)
        {
            Toast("Atenção", "Informe o nome do produto");
            return;
        }

        if(!produto.Description)
        {
            Toast("Atenção", "Informe a descrição do produto");
            return;
        }

        if(!produto.Price || Number.isNaN(produto.Price) || produto.Price <= 0)
        {
            Toast("Atenção", "Informe o preço do produto");
            return;
        }

        if(!produto.Storage || Number.isNaN(produto.Storage) || produto.Storage <= 0)
        {
            Toast("Atenção", "Informe a quantidade do produto");
            return;
        }

        ShowConfirm(SalvarProduto);  
    }
   
    let SalvarProduto = async () => {        

        let postResult = await fetch(`http://192.168.15.144:60000/product/${editing ? "update" : "create"}`, 
            {
                method: editing ? 'PUT' : 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                  },
                body: JSON.stringify(GetProduto())
            });
            
        if(!postResult.ok)        
            Toast("Erro", await postResult.text());   
        else
        {
            let id = editing? product?.Id : (await postResult.json()).Id;

            let uploadImage = await SalvarImagem(id);

            if(uploadImage)
                Toast("Sucesso", `Produto ${editing ? "alterado" : "incluido"} na base de dados`, ()=>{window.location.href = "http://192.168.15.144:3000/"});           
        }    
        
    };

    let SalvarImagem = async (productId : string) : Promise<boolean> =>
    {
        let files = (document.getElementById("imagem-produto") as any).files as Array<Blob>;

        if(files.length == 0)
            return true;

        let data = new FormData();        
        data.append('image', files[0]);

        let responseUpload = await fetch(`http://192.168.15.144:60000/product/set-image?productId=${productId}`, 
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
         (document.getElementById("imagem-produto") as any).click();
    }

    let ArquivoSelecionado = () => 
    {
        if((document.getElementById("imagem-produto") as any).files.lenght == 0)
            return;

        let fileReader = new FileReader();

        fileReader.onload = function(e)
        {
            (document.getElementById('img-produto') as any).src = e.target?.result;
        }

        fileReader.readAsDataURL((document.getElementById("imagem-produto") as any).files[0]);
    }

    let ValueChange = () => 
    {
        let nome = (document.getElementById("nome-produto") as any).value;
        let descricao = (document.getElementById("descricao-produto") as any).value;
        let preco = (document.getElementById("preco-produto") as any).value;
        let estoque = (document.getElementById("estoque-produto") as any).value;
        let status = (document.getElementById("status-produto") as any).value == 1;

        SetProduct(new Product(editing ? product!.Id : "", descricao, nome, Number.parseFloat(preco), Number.parseInt(estoque)).SetActive(status));        
        

    }

    return(

        <div className="EditProduct">
            <input type='file' id='imagem-produto' hidden onChange={()=> ArquivoSelecionado()}/>
            <img className='ProductImage' id="img-produto" src={editing? 
                `http://192.168.15.144:60000/product/get-image?productId=${product?.Id}`: 
                `http://192.168.15.144:60000/product/get-default-image`} onClick={()=> SelecionarArquivo()}/>
            <>
            <code>Nome</code>
            <input id="nome-produto" type='text' placeholder='Nome do produto' value={editingProduct?.Name} onChange={()=>{ValueChange()}}/>
            </>
            <>
            <code>Descrição</code>
            <input id="descricao-produto" type='text' placeholder='Descrição do produto' value={editingProduct?.Description} onChange={()=>{ValueChange()}}/>
            </>
            <>
            <code>Preço</code>
            <input id="preco-produto" type='number' placeholder='Preço do produto' value={editingProduct?.Price} onChange={()=>{ValueChange()}}/>
            </>
            <>
            <code>Estoque</code>
            <input id="estoque-produto" type='number' placeholder='Unidades em estoque' value={editingProduct?.Storage} onChange={()=>{ValueChange()}}/>
            </>
            <>
            <code>Status</code>
                <select id="status-produto" onChange={()=>{ValueChange()}} defaultValue={editingProduct?.Active ? 1 : 0}>
                    <option  value={1}>Ativo</option>
                    <option  value={0}>Desativado</option>
                </select>
            </>
            <hr/>
            <div className='ButtonsContainer'>
                <Button Text='Cancelar' Type='Cancel' OnClickEventHandler={()=>{ navigation(-1) }}/>
                <Button Text='Salvar' Type='Save' OnClickEventHandler={SalvarClick}/>
            </div>
        </div>
    );
}