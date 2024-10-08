
export default class Product
{   
    public Id: string;
    public Name : string;
    public Description : string;
    public Price : number;
    public Storage : number;
    public Active : boolean; 
    public Image? : string;   
     
    
    constructor(id: string, description : string, name: string, price: number, storage: number, image? : string)
    {
        this.Id = id;
        this.Name = name;
        this.Description = description;
        this.Price = price;
        this.Storage = storage;
        this.Image = image;
        this.Active = true;        
    }

    public SetActive(status : boolean) : Product
    {
        this.Active = status;
        return this;
    }
}

