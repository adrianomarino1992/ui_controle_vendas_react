
import './Button.css';

export default function Button(props :
    {Text: string, 
        Type: "Save" | "Cancel" | "Login", 
        OnClickEventHandler : ()=> void,
    })  
{

    let OKClick = (evt: any) => 
    {
        props.OnClickEventHandler();
    }

    return(
        <button className={`Btn${props.Type}`}
        style={{display: props.Text ? "block": "none"}}
        onClick={OKClick} >       
        {props.Text}
        </button>
    )
}