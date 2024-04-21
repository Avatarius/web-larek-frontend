import { IProduct } from "../types";
import { Model } from "./base/Model";
import { IEvents } from "./base/events";

interface IBasket {
  items: IProduct[];
}

class Basket extends Model<IBasket> {
  protected _items: IProduct[];

  constructor(data: Partial<IBasket>, events: IEvents) {
    super(data, events);
    this._items = [];
  }

  add(item: IProduct) {
    if (this._items.includes(item)) return;
    this._items.push(item);
    this.emitChanges('basket:items-changed');
  }

  remove(id: string) {
    this._items = this._items.filter((item) => item.id !== id);
    this.emitChanges('basket:items-changed');
  }

  contains(id: string): boolean {
    const item = this._items.find((item) => item.id === id)
    return !Boolean(item);
  }

  clear() {
    this._items = [];
  }

  get items() {
    return this._items;
  }

  get total() {
    return this._items.reduce((sum, item) => {
      return item.price + sum;
    }, 0);
  }

  get length() {
    return this._items.length;
  }

}


export {Basket};
