
import './Button.css';

export default function Button(props :
    {Text: string, 
        Type: "Save" | "Cancel", 
        OnClickEventHandler : ()=> void,
    })  
{

    let OKClick = (evt: any) => 
    {
        props.OnClickEventHandler();
    }

    return(
        <button 
        style={{display: props.Text ? "block": "none"}}
        onClick={OKClick} >       
        {props.Text}
        </button>
    )
}