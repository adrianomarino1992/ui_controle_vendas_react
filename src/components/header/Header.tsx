import { useGlobalContext } from '../../global/GlobalContext';
import './Header.css';
import hist from './history.png';

export default function Header()
{
    let context = useGlobalContext();

    let closeMenu = () =>
    {
        document.getElementById('header-menu')!.style.display = 'none';
    };

    return(
        <header className="Header">
            <code>D-Delicias</code> 
            <img  src={hist} className='Menubtn' onMouseEnter={()=>{
                document.getElementById('header-menu')!.style.display = 'flex';
            }}
            onClick={()=>{
                document.getElementById('header-menu')!.style.display = 'flex';
            }}
            />
            <div className='MenuHeader' id="header-menu">
                <p onClick={()=>{ closeMenu(); context!.Data!.Navigate!('/products', []);}}>Produtos</p>
                <p onClick={()=>{ closeMenu(); context!.Data!.Navigate!('/users', []);}}>Usuarios</p>
                <p onClick={()=>{ closeMenu(); context!.Data!.Navigate!('/history', []);}}>Historico</p>               
                <p onClick={()=>{ closeMenu(); context!.Data!.Navigate!('/payment', []);}}>Pagar</p>               
            </div>  
        </header>
    );
}