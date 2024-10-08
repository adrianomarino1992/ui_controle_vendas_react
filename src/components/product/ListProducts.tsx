import './ListProducts.css';

import { useEffect, useState } from "react";
import Product from '../../entities/product/Product';
import ProductCard from "./ProductCard";
import { useGlobalContext } from '../../global/GlobalContext';
import { useNavigate } from 'react-router-dom';
import User from '../../entities/user/User';

export default function ProductsContainer()
{
    let [products, setProducts] = useState<Product[]>([]);

    let navigation = useNavigate();
    
    let context = useGlobalContext();

    context!.Data!.Navigate = (e, v) => navigation(e, {state : v}) ;

    
    useEffect(()=>{

        (async ()=>{

            let getTaskResult = await fetch('http://192.168.15.144:60000/product/list-all');
            let productsArray = await getTaskResult.json() as Product[];            
            setProducts(productsArray);

            if(context?.Data?.CurrentUser?.Name == User.GetSuperName())
                productsArray.Add(new Product("", "Adicione um novo produto", "Novo", -1, -1, ""));

        })();

        if(context && context.Data && context.Data.CheckLogin)
            context!.Data!.CheckLogin!();

    }, []);

   

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