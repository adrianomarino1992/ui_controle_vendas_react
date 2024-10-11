import './ProductCard.css';
import Product from "../../entities/product/Product";
import {  useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../global/GlobalContext';
import { MessageDialog } from '../messagebox/MessageBox';
import User from '../../entities/user/User';
import Order, { OrderItem } from '../../entities/order/Order';
import { API } from '../../api/API';


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
                    
                    let buyResponse = await API.RequestAsync('/order/create', context?.Data?.Token ?? "", 'POST', order );                  

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
                `${API.URL}/product/static/get-image?productId=${props.product.Id}&timestamp=${new Date().getTime()}` : 
                `${API.URL}/product/static/get-new-image?timestamp=${new Date().getTime()}`
                }/>
            <h3>{props.product.Name}</h3>
            
            {
                props.product.Id && 
                <>
                <h4>{props.product.Description}</h4>
                <div className="CardPrice">R$: <code>{props.product.Price.toFixed(2)}</code></div>
                {
                    context?.Data?.CurrentUserIsSuperUser() && 
                    (
                        <div>Estoque: <code>{props.product.Storage}</code></div>

                    )
                }
                </>
            }
        </div>
        
    );
}