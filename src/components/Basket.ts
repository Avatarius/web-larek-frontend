import { IProduct } from "../types";
import { Model } from "./base/Model";
import { IEvents } from "./base/events";

interface IBasket {
  add(item: IProduct): void;
  remove(id: string): void;
  items: IProduct[];
  total: number;
}

class Basket extends Model<IBasket>  implements IBasket{
  protected _items: IProduct[];

  constructor(data: Partial<IBasket>, events: IEvents) {
    super(data, events);
    this._items = [];
  }

  add(item: IProduct) {
    if (this._items.includes(item)) return;
    this._items.push(item);
    this.events.emit('basket:items-changed');
  }

  remove(id: string) {
    this._items = this._items.filter((item) => item.id !== id);
    this.events.emit('basket:items-changed');
  }

  contains(id: string): boolean {
    const item = this._items.find((item) => item.id === id)
    return !Boolean(item);
  }

  get items() {
    return this._items;
  }

  get total() {
    return this._items.length;
  }

}


export {Basket};
