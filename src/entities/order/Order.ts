
export default class CreateOrderDTO 
{
    public UserId: string;
    public Itens : OrderItem[];
    public Id: string;

    constructor(id: string, userId: string, itens: OrderItem[]) 
    {
        
        this.Id = id;
        this.UserId = userId;
        this.Itens = itens;
    }        

}

export class OrderItem 
{
    public ProductId : string;
    public ProductName: string;
    public ProductPrice : number;
    public ProductQuantity : number;

    constructor(productId: string, productName: string, productPrice : number, productQuantity: number)
    {        
        this.ProductName = productName;
        this.ProductId = productId;
        this.ProductPrice = productPrice;
        this.ProductQuantity = productQuantity;
    }
    

}

