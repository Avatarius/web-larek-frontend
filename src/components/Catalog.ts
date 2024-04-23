import { Model } from './base/Model';
import { IProduct } from '../types';
import { IEvents } from './base/Events';

interface ICatalogData {
	items: IProduct[];
}

class Catalog extends Model<ICatalogData> {
	protected _items: IProduct[];

	constructor(data: Partial<ICatalogData>, events: IEvents) {
		super(data, events);
	}

	get items() {
		return this._items;
	}

	set items(list: IProduct[]) {
		this._items = list;
		this.emitChanges('catalog:items-changed', this._items);
	}

	find(id: string): IProduct | undefined {
		return this._items.find((item) => item.id === id);
	}
}

export { Catalog };
