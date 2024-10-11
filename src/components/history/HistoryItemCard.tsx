import './HistoryItemCard.css';
import { History } from "../../entities/history/History";
import { API } from '../../api/API';
import Utils from '../../utils/Utils';


export default function HistoryItemCard(props : {histories: History})
{

    let isPayment = props.histories.IsPayment ?? false;
    

    return(
        <div className="HistoryItemCard">
            <img className={isPayment ? "Image Navegable" : "Image"} src={isPayment ?
             `${API.URL}/order/static/get-image?paymentId=${props.histories.Id}` : 
             `${API.URL}/product/static/get-image?productId=${props.histories.ProdutcId}` 
             }
             onClick={()=>{

                if(!isPayment)
                    return;
                window.open(`${API.URL}/order/static/download-image?paymentId=${props.histories.Id}`, '_blank');
             }}
             />
            <div className="Content">

                {isPayment && (
                    <>
                    <p>Protocolo: <code>{props.histories.Id}</code></p>
                    <p>Valor: <code>R$ {props.histories.Amount?.toFixed(2).replace('.', ',')}</code></p>
                    <p>Data: <code>{Utils.CastDateToString(new Date(props.histories.Date!))}</code></p>
                    <div className='Receita'>
                        <p>Saldo no momento: <code>R$ {props.histories.UserBalance?.toFixed(2).replace('.', ',')}</code></p>
                    </div>
                    </>
                )}

                {!isPayment && (
                    <>            
                    <p>Protocolo: <code>{props.histories.Id}</code></p>        
                    <p>Produto: <code>{props.histories.ProductName}</code></p>
                    <p>Preço: <code>R$ {props.histories.ProdutcPrice?.toFixed(2).replace('.', ',')}</code></p>
                    <p>Data: <code>{Utils.CastDateToString(new Date(props.histories.Date!))}</code></p>
                    {props.histories.PaymentDate && (
                        <p>Data de pamento: <code>{Utils.CastDateToString(new Date(props.histories.PaymentDate!))}</code></p>
                    )}
                    <div className='Despesa'>
                        <p>Saldo no momento: <code>R$ {props.histories.UserBalance?.toFixed(2).replace('.', ',')}</code></p>
                    </div>
                    </>
                )}
               
            </div>
        </div>
       
    );
}