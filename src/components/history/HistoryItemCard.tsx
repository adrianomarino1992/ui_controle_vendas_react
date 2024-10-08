import './HistoryItemCard.css';
import { History } from "../../entities/history/History";


export default function HistoryItemCard(props : {histories: History})
{

    let isPayment = props.histories.IsPayment ?? false;

    let castDate = (date : Date): string =>
    {
        let day = date.getDate().toString().padStart(2, '0');
        let month = date.getMonth().toString().padStart(2, '0');
        let year = date.getFullYear();
        let hour = date.getHours().toString().padStart(2, '0');
        let minuts = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hour}:${minuts}`;
    }

    return(
        <div className="HistoryItemCard">
            <img className={isPayment ? "Image Navegable" : "Image"} src={isPayment ?
             `http://192.168.15.144:60000/order/get-image?paymentId=${props.histories.Id}` : 
             `http://192.168.15.144:60000/product/get-image?productId=${props.histories.ProdutcId}` 
             }
             onClick={()=>{

                if(!isPayment)
                    return;
                window.open(`http://192.168.15.144:60000/order/download-image?paymentId=${props.histories.Id}`, '_blank');
             }}
             />
            <div className="Content">

                {isPayment && (
                    <>
                    <p>Protocolo: <code>{props.histories.Id}</code></p>
                    <p>Data: <code>{castDate(new Date(props.histories.Date!))}</code></p>
                    <div className='Receita'>
                        <p>Saldo no momento: <code>R$ {props.histories.UserBalance?.toFixed(2).replace('.', ',')}</code></p>
                    </div>
                    </>
                )}

                {!isPayment && (
                    <>            
                    <p>Protocolo: <code>{props.histories.Id}</code></p>        
                    <p>Produto: <code>{props.histories.ProductName}</code></p>
                    <p>Preço: <code>{props.histories.ProdutcPrice?.toFixed(2).replace('.', ',')}</code></p>
                    <p>Data: <code>{castDate(new Date(props.histories.Date!))}</code></p>
                    {props.histories.PaymentDate && (
                        <p>Data de pamento: <code>{castDate(new Date(props.histories.PaymentDate!))}</code></p>
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