import { IEvents } from "../components/base/events";

interface IModel {
  emitChanges(event:string, data?: object): void;
}

interface IView<T> {
  toggleClass(element: HTMLElement, className: string, force?: boolean): void;
  setText(element: HTMLElement, value: unknown): void;
  setDisabled(element: HTMLElement, state: boolean): void;
  setHidden(element: HTMLElement): void;
  setVisible(element: HTMLElement): void;
  setImage(element: HTMLElement, src: string, alt?: string): void;
  render(data?: Partial<T>): HTMLElement;
}


interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

interface IBasketItem extends IProduct {
  index: number;
}


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
  getProductList(): Promise<IProduct[]>;
  getProductItem(id:string): Promise<IProduct>;
  postOrder(order: IOrder): Promise<IOrderResult>;
}

interface IClickActions {
  onClick: (event: MouseEvent) => void;
}

interface IFormState {
  valid: boolean;
  error: string;
}

interface IFormInput {
  field: string;
  value: string;
}


export type {IModel, IView, IShopApi, IProduct, IBasketItem, IOrder, IOrderResult, IDelivery, IClickActions, IFormState, IFormInput};
