import './ProductCard.css';
import Product from "../../entities/product/Product";
import {  useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../global/GlobalContext';
import { MessageDialog } from '../messagebox/MessageBox';
import User from '../../entities/user/User';
import Order, { OrderItem } from '../../entities/order/Order';


export default function ProductCard(props : {product : Product})
{
    let navigation = useNavigate();

    let context = useGlobalContext();

    let clickEventHandler = () =>
    {       

        if(context!.Data!.CurrentUser!.Name == User.GetSuperName())
            navigation('/product', {state: props.product});
        else
            MessageDialog.Show({
                IsOpen: true,
                Message: `Comprar produto ${props.product.Name}?`,
                OKText: "Comprar",
                Title: "Comprar produto",
                OKClickEvent : async function()
                {
                    let item = new OrderItem(props.product.Id, props.product.Name, props.product.Price, 1);
                    let order = new Order("", context!.Data!.CurrentUser!.Id, [item]);
                    
                    let buyResponse = await fetch('http://192.168.15.144:60000/order/create', 
                    {
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json', // Tipo de conteúdo a ser enviado
                          },
                        body: JSON.stringify(order)
                    });

                    if(!buyResponse.ok)
                        MessageDialog.Toast("Erro ao comprar o produto", await buyResponse.text());
                    else{

                        context!.Data!.UpdateCurrentUser!();
                           
                        MessageDialog.Toast("Compra concluida", `Produto ${props.product.Name} comprado`);
                    }
                          
                    
                    
                }, 

                Canceltext: "Cancelar",
                CancelEvent: ()=>{}            

            });
    }

    return(

        <div className="ProductCard" onClick={()=>clickEventHandler()} 
        style={props.product.Active ? {opacity: "100%"} : {opacity: "30%"}}>            
            <img className='ProductImage' src={
                props.product.Id ?
                `http://192.168.15.144:60000/product/get-image?productId=${props.product.Id}` : 
                `http://192.168.15.144:60000/product/get-new-image`
                }/>
            <h3>{props.product.Name}</h3>
            
            {
                props.product.Id && 
                <>
                <h4>{props.product.Description}</h4>
                <div className="CardPrice">R$: <code>{props.product.Price.toFixed(2)}</code></div>
                </>
            }
        </div>
        
    );
}