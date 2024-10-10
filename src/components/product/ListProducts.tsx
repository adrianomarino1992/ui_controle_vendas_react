import './ListProducts.css';

import { useEffect, useState } from "react";
import Product from '../../entities/product/Product';
import ProductCard from "./ProductCard";
import { useGlobalContext } from '../../global/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { MessageDialog } from '../messagebox/MessageBox';
import { API } from '../../api/API';

export default function ProductsContainer()
{
    let [products, setProducts] = useState<Product[]>([]);
    let [reload, forReload] = useState(0);

    let navigation = useNavigate();
    
    let context = useGlobalContext();    

    context!.Data!.Navigate = (e, v) => navigation(e, {state : v}) ;

    useEffect(()=>{
        
        if(context && context.Data && context.Data.CheckLogin)
            context!.Data!.CheckLogin!();

        context?.Data?.OnLogin?.Add((u)=> {
            forReload(1);
        });
        
        (async ()=>{

            await CarregarProdutos();            

        })();        

    }, [reload]);

   
    let CarregarProdutos = async function(){      

        if(!context?.Data?.Token)
        {
            context!.Data!.CheckLogin!();
            return;
        }


        let getTaskResult = await API.RequestAsync('/product/list-all', context.Data.Token, 'GET');
        
        if(getTaskResult.status == 403)
        {            
            
            if(context?.Data?.CurrentUser != undefined)
                MessageDialog.Show({
                IsOpen: true,
                Message: "Sua sessão expirou, você foi redirecionado para a tela de login", 
                Title: "Sessão expirou", 
                OKText: "OK", 
                OKClickEvent: () => window.location.reload()
                });

            context!.Data!.CheckLogin!();
            return;
        }

        if(!getTaskResult.ok)
        {
            MessageDialog.Toast("Erro ao carregar os produtos", await getTaskResult.text());
            return;
        }

        let productsArray = await getTaskResult.json() as Product[];            
        setProducts(productsArray);

        if(context && context.Data && context.Data.CurrentUser)
            if(context.Data.GetCurrentUser()?.IsSuperUser())
                productsArray.Add(new Product("", "Adicione um novo produto", "Novo", -1, -1, ""));
    }


    return(
        
        <div className="ProductsContainer">

            <div className="Products">
                {products && products.Select(s => (
                    
                    <ProductCard key={s.Id} product={s}/>
                ))}
            </div>
        </div>
        
    );
}