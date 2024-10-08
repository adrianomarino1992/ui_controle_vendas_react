import { useState } from 'react';
import { useGlobalContext } from '../../global/GlobalContext';
import './Footer.css';
import hist from './history.png';

export interface IFooterData
{
    Username : string;
    BalanceString : string;    

}

export default function Footer()
{
    let context = useGlobalContext();
    let [data, setData] = useState<IFooterData>({Username: "Aguardando login", BalanceString: "Aguardando login"});
    context!.Data!.UpdateStatusBarHandler = (e) => setData(e);

    return (

        <footer className='Footer'>
            <code>{data.Username}</code>
            <code>{data.BalanceString}</code>
            <img id="hist-btn" src={hist} onClick={()=>{
                context?.Data?.Navigate!('/payment', []);
            }}/>
        </footer>
    );
}