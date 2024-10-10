
export default class User 
{
    public Id : string;
    public Name : string;
    public Login : string;
    public Password : string;
    public Departament : string;
    public Active : boolean;
    public Image? : string;
    public Balance : number;
    public LastPaymante? : Date;

    public static GetSuperName()
    {
        return "ADMIN";
    }

    public static GetDeveloperName()
    {
        return "DEVELOPER";
    }

    constructor(id: string, name: string, login: string, password: string, departament: string, image? : string) 
    {         
        this.Id = id;
        this.Name = name;
        this.Login = login;
        this.Password = password;
        this.Departament = departament;
        this.Active = true;
        this.Image = image;
        this.Balance = 0;
        this.LastPaymante = undefined;

    }

    public SetActive(status: boolean)
    {
        this.Active = status;
        return this;
    }

    public SetBalance(balance : number)
    {
        this.Balance = balance;
        return this;
    }

    public IsSuperUser()
    {
        return this.Name == User.GetSuperName() || this.Name == User.GetDeveloperName();
    }

    
}