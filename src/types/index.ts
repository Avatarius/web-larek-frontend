import { IEvents } from '../components/base/events';

interface IModel {
	emitChanges(event: string, data?: object): void;
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

type PaymentMethod = 'cash' | 'card';

interface IDelivery {
	payment: PaymentMethod;
	address: string;
}

interface IDeliveryForm {
	payment: string;
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

type IOrderData = IDelivery & IContacts & IOrderList;

interface IOrderBuilder {
	delivery: IDelivery;
	contacts: IContacts;
	orderList: IOrderList;
	result: IOrderData;
}

interface IOrderResult {
	id: string;
	total: number;
}

interface IShopApi {
	getProductList(): Promise<IProduct[]>;
	getProductItem(id: string): Promise<IProduct>;
	postOrder(order: IOrderData): Promise<IOrderResult>;
}

interface IClickActions {
	onClick: (event: MouseEvent) => void;
}

interface IFormState {
	valid: boolean;
	error: string;
}

interface IForm<T> extends IFormState {
  render(data?: IFormState): HTMLElement;
}

interface IInputData {
	field: string;
	value: string;
}

export type {
	IModel,
	IView,
	IShopApi,
	IProduct,
	PaymentMethod,
	IBasketItem,
	IOrderData,
  IContacts,
	IOrderResult,
  IOrderList,
  IOrderBuilder,
	IDelivery,
  IDeliveryForm,
	IClickActions,
	IFormState,
  IForm,
	IInputData,
};
