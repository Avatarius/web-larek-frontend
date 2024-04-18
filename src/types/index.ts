interface IProductItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

interface IProductItemUI {
  title: string;
  description: string;
  category: string;
  price: string;
  image: string;
}
type IProductCardUI = Pick<IProductItemUI, 'title' | 'category' | 'price' | 'image'>
type IBasketItemUI = Pick<IProductItemUI, 'title' | 'price'>;


type PaymentMethod = 'cash' | 'online';

interface IDelivery {
  payment: PaymentMethod;
  address: string;
}

interface IContacts {
  email: string;
  phone: string;
}

interface IOrderList {
  total: number;
  items: string[];
}

type IOrder = IDelivery & IContacts & IOrderList;

interface IOrderBuilder {
  setDelivery(delivery: IDelivery): void;
  setContacts(contacts: IContacts):void;
  setOrderList(orderList: IOrderList): void;
  getResult(): IOrder;
}

interface IOrderResult {
  id: string;
  total: number;
}

interface IShopApi {
  getProductList(): Promise<IProductItem[]>;
  getProductItem(id:string): Promise<IProductItem>;
  postOrder(order: IOrder): Promise<IOrderResult>;
}
