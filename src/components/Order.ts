import {
	IDelivery,
	IOrderData,
	IContacts,
	IOrderBuilder,
	IOrderList,
	PaymentMethod,
} from '../types';
import { Model } from './base/Model';
import { IEvents } from './base/events';


interface IOrder extends IOrderData {
  toApiObject(): IOrderData;
}

class Order implements IOrder {
  protected _payment: PaymentMethod;
	protected _address: string;
	protected _email: string;
	protected _phone: string;
	protected _total: number;
	protected _items: string[];

  set payment(value: PaymentMethod) {
    this._payment = value;
  }

  set address(value: string) {
    this._address = value;
  }

  set email(value: string) {
    this._email = value;
  }

  set phone(value: string) {
    this._phone = value;
  }

  set total(value: number) {
    this._total = value;
  }

  set items(list: string[]) {
    this._items = list;
  }

  toApiObject(): IOrderData {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
      total: this._total,
      items: this._items
    };
  }


}

class OrderBuilder extends Model<IOrderBuilder>  {
	protected order: IOrder;

	constructor(data: Partial<IOrderBuilder>, events: IEvents) {
		super(data, events);
    this.order = new Order();
	}

	set delivery(delivery: IDelivery) {
		this.order.payment = delivery.payment;
		this.order.address = delivery.address;
	}

	set contacts(contacts: IContacts) {
		this.order.email = contacts.email;
		this.order.phone = contacts.phone;
	}

	set orderList(orderList: IOrderList) {
		this.order.total = orderList.total;
		this.order.items = orderList.items;
	}

  get result(): IOrder {
    return this.order;
  }





}

export { OrderBuilder };
