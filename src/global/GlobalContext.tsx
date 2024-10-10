import { createContext, ReactNode, useContext, useState } from "react";
import User from "../entities/user/User";
import { IFooterData } from "../components/footer/Footer";

export interface IGlobalContextProps
{
    Data : IGlobalContextData | undefined, 
    SetData : (newData : IGlobalContextData) => void
}

export interface IGlobalContextData
{
    CurrentUser: User | undefined;
    Token? : string,
    GetCurrentUser : ()=> (User | undefined)
    OnLogin? : ((currentUser : User) => void)[];
    CheckLogin? : ()=>void;
    CurrentUserIsSuperUser: ()=> boolean,
    Navigate? : (path: string, args: any) => void,
    UpdateStatusBarHandler?: (data: IFooterData) => void,
    UpdateCurrentUser?: () => void
}

const ContextType = createContext<IGlobalContextProps | undefined>(undefined);

export default function GlobalContext({children} : {children : ReactNode[]} )
{
    let [data, setData] = useState<IGlobalContextData>(
    {
            CurrentUser : undefined, 
            GetCurrentUser : ()=> undefined, 
            CheckLogin: ()=> 
            {               
                if(!data.Navigate)
                    window.location.href = 'http://192.168.15.144:3000/products';
                else
                    data!.Navigate!("/products", []);
            }, 
            CurrentUserIsSuperUser : () => false, 
            OnLogin : []
    });

    return (

        <ContextType.Provider value={{Data: data, SetData : setData}}>
            {children}
        </ContextType.Provider>
    );
}

export function useGlobalContext()
{
    return useContext(ContextType);
}