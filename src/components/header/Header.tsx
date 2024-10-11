import { useEffect, useState } from 'react';
import User from '../../entities/user/User';
import { useGlobalContext } from '../../global/GlobalContext';
import './Header.css';
import hist from './history.png';

export default function Header()
{
    let context = useGlobalContext();

    let [reload, forceReload] = useState(0);

    var timeout: any | undefined;

    let closeMenu = () =>
    {
        document.getElementById('header-menu')!.style.display = 'none';
    };

    context?.Data?.OnLogin?.Add(()=> forceReload(1));

   

    return(
        <header className="Header">
            <code>D-Delicias</code> 
            <img  src={hist} className='Menubtn' onMouseEnter={()=>{

                if(timeout)
                    window.clearTimeout(timeout);

                timeout = setTimeout(()=>{
                    closeMenu();
                }, 3000);

                document.getElementById('header-menu')!.style.display = 'flex';
            }}
            
            onClick={()=>{
                document.getElementById('header-menu')!.style.display = 'flex';
            }}
            />
            <div className='MenuHeader' id="header-menu" style={{
                height : context && context.Data?.GetCurrentUser()?.IsSuperUser() ? 
                (window.innerWidth > 600 ? '100px' : '115px'): 
                (window.innerWidth > 600 ? '115px' : '130px')
            }}>
                <p onClick={()=>{ closeMenu(); context!.Data!.Navigate!('/products', []);}}>Produtos</p>
                {
                    context?.Data?.CurrentUser?.IsSuperUser() && (
                    <p onClick={()=>{ closeMenu(); context!.Data!.Navigate!('/users', []);}}>Usuarios</p>
                    )
                }
                {
                    !context?.Data?.CurrentUser?.IsSuperUser() && (
                    <p onClick={()=>{ closeMenu(); context!.Data!.Navigate!('/users', []);}}>Meus dados</p>
                    )
                }
                
                <p onClick={()=>{ closeMenu(); context!.Data!.Navigate!('/history', []);}}>Historico</p> 
                {
                    !(context && context.Data?.GetCurrentUser()?.IsSuperUser()) && (
                        <p onClick={()=>{ closeMenu(); context!.Data!.Navigate!('/payment', []);}}>Pagar</p> 
                    )                                        
                }              
                   
            </div>  
        </header>
    );
}