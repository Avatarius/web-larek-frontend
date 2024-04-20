import { IModel } from "../../types";
import { IEvents } from "./events";



abstract class Model<T> implements IModel {
  protected events: IEvents;
  constructor(data: Partial<T>, events: IEvents) {
    this.events = events;
    Object.assign(this, data);
  }

  emitChanges(event: string, data?: object) {
    this.events.emit(event, data ?? {});
  }
}


export {Model};
