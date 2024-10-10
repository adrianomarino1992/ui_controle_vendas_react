import './UserCard.css';
import User from '../../entities/user/User';
import { useNavigate } from 'react-router-dom';
import { API } from '../../api/API';
import Utils from '../../utils/Utils';


export default function UserCard(props : {user : User})
{
    let navigation = useNavigate();

    return(

        <div className="UserCard" onClick={()=> navigation('/user', {state: props.user})} 
        style={props.user.Active ? {opacity: "100%"} : {opacity: "30%"}}>            
            <img className='UserImage' src={
                props.user.Id ?
                `${API.URL}/user/static/get-image?userId=${props.user.Id}` : 
                `${API.URL}/user/static/get-new-image`
                }/>
            <h3>{props.user.Login}</h3>
            
            {
                props.user.Id && 
                <>
                <h4>{props.user.Name}</h4>                
                <h4>{props.user.Departament ? props.user.Departament : "Departamento não informado"}</h4>   
                <h4><code>R$ {props.user.Balance.toFixed(2).replace('.', ',')}</code></h4>                 
                {props.user.LastPaymante && <h4>Ultimo pagamento: <code>{Utils.CastDateToString(new Date(props.user.LastPaymante))}</code></h4>}
                {!props.user.LastPaymante && <h4>Ultimo pagamento: Ainda não ocorreu</h4>}
                </>
            }
        </div>
        
    );
}