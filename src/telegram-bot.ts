import { EventEmitter } from "eventemitter3";
import { TelegramContext } from "./telegram-context";
import { Update } from "telegram-typings";

type EventType = "text" | "photo" | "inline" | "unknown";

export declare interface TelegramBot {
  on<T extends EventType>(
    event: T,
    fn: (context: TelegramContext) => void,
    context?: any
  ): this;
  emit<T extends EventType>(event: T, update: Update): boolean;
}

export class TelegramBot extends EventEmitter<EventType> {
  constructor(private readonly token: string) {
    super();
  }

  override emit<T extends EventType>(event: T, update: Update): boolean {    
    const context = new TelegramContext(this.token, update);
    if (this.eventNames().includes(event)) {
      this.listeners(event).forEach((cb) => cb(context));
      return true;
    }
    return false;
  }

  onInlineQuery(fn: (context: TelegramContext) => void): this {
    this.on("inline", fn);    
    return this;
  }

  private identifyEventType(update: Update): EventType {
    if (update.message) {
      if (update.message.text) {
        return "text";
      } else if (update.message.photo) {
        return "photo";
      } else {
        return "unknown";
      }
    } else if (update.inline_query) {
      return "inline";
    }
  }

  update(update: Update) {
    const event = this.identifyEventType(update);
    this.emit(event, update);
  }
}
