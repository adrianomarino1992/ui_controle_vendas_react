import { useEffect, useState } from 'react';
import Button from '../shared/button/Button';
import './MessageBox.css';


export interface IMessageBoxConfigurations
{ 
    Title: string, 
    Message: string,
    OKText: string, 
    Canceltext?: string,
    IsOpen: boolean,
    OKClickEvent : ()=>void,
    CancelEvent? : ()=>void 
}

export class MessageDialog
{
    private static openDialog? : IMessageBoxConfigurations;

    private static setDialogOpen : (config : IMessageBoxConfigurations) => void;

    public static Show(config: IMessageBoxConfigurations)
    {
        MessageDialog.setDialogOpen(config);
    }

    public static Toast = (title: string, message: string, action?: ()=> void) =>
    {
        if(!MessageDialog.openDialog || !MessageDialog.setDialogOpen)
            return;

        MessageDialog.setDialogOpen(
            {...MessageDialog.openDialog, 
                IsOpen: true,
                Title: title,
                Message: message, 
                Canceltext: "",
                OKClickEvent: action ?? (()=>{}) 
        }); 
    }
}

export default function MessageBox()
{
    let [openDialog, setDialogOpen] = useState<IMessageBoxConfigurations>(
        {
            IsOpen: false, 
            Message: "Body",
            OKText: "OK",
            Title: "Title",
            OKClickEvent : ()=>{ console.log("ok")}

        });

    MessageDialog["openDialog"] = openDialog;
    MessageDialog["setDialogOpen"] = setDialogOpen;
   

    let CalcelarClick = ()=>
    {            
        setDialogOpen({...openDialog, IsOpen: false});

        if(openDialog.CancelEvent)
            openDialog.CancelEvent();
                    
    };

    let OKClick = ()=>
    {      
        setDialogOpen({...openDialog, IsOpen: false});

        openDialog.OKClickEvent();
            
    };

    return(        
        

        <div className="MessageBox" style={openDialog.IsOpen ? {display: 'flex'} : {display: 'none'}}>
            
            <div className="MessageBoxDialog">
                <h1>{openDialog.Title}</h1>
                <p>{openDialog.Message}</p>
                <div className='ButtonsContainer'>
                    <Button Text={openDialog.Canceltext ?? ""} Type='Cancel' OnClickEventHandler={CalcelarClick}/>
                    <Button Text={openDialog.OKText} Type='Save' OnClickEventHandler={OKClick}/>
                </div>
            </div>
        </div>
    );
}   