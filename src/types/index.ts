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

interface IIdentifier {
	id: string;
}

type ICatalogCard = Omit<IProduct, 'description'>;
type IPreviewCard = IProduct & { valid: boolean; state: boolean };
type IBasketCard = Omit<IProduct, 'description' | 'category' | 'image'> & {
	index: number;
};

type PaymentMethod = 'cash' | 'card';

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

interface IFormState {
	valid: boolean;
	error: string;
}

interface IForm extends IFormState {
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
	IIdentifier,
	ICatalogCard,
	IPreviewCard,
	IBasketCard,
	PaymentMethod,
	IOrderData,
	IContacts,
	IOrderResult,
	IOrderList,
	IOrderBuilder,
	IDelivery,
	IFormState,
	IForm,
	IInputData,
};
