import { TelegramContext } from "./telegram-context";
import { Update } from "telegram-typings";

type EventType = "text" | "photo" | "audio" | "inline" | "callback" | "unknown";

interface ContextFn {
  (context: TelegramContext): Promise<void>;
}

export class TelegramBot {
  private eventPool: Map<string | symbol, ContextFn[]> = new Map();
  constructor(private readonly token: string) {}

  on<T extends EventType>(event: T, fn: ContextFn) {
    if (!this.eventPool.get(event)) {
      this.eventPool.set(event, []);
    }
    this.eventPool.get(event).push(fn);
    return this;
  }

  async emit<T extends EventType>(event: T, update: Update) {
    const context = new TelegramContext(this.token, update);

    if (Array.from(this.eventPool.keys()).includes(event)) {
      for (const cb of this.eventPool.get(event)) {
        await cb(context);
      }
    }
  }

  onInlineQuery(fn: ContextFn): this {
    this.on("inline", fn);
    return this;
  }

  onCallbackQuery(fn: ContextFn): this {
    this.on("callback", fn);
    return this;
  }

  onMatch(regx: RegExp, fn: ContextFn): this {
    this.on("text", async (ctx) => {
      if (regx.test(ctx.update.message.text)) {
        await fn(ctx);
      }
    });
    return this;
  }

  onCommand(command: string, fn: ContextFn): this {
    this.on("text", async (ctx) => {
      const regx = new RegExp(`^/${command}(.*)`);
      if (
        ctx.update.message.entities?.some((x) => x.type === "bot_command") &&
        regx.test(ctx.update.message.text)
      ) {
        await fn(ctx);
      }
    });
    return this;
  }

  onReply(fn: ContextFn) {
    this.on("text", async (ctx) => {
      if (ctx.update.message.reply_to_message) {
        await fn(ctx);
      }
    });
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
    } else if (update.callback_query) {
      return "callback";
    }
  }

  async update(update: Update) {
    const event = this.identifyEventType(update);
    return await this.emit(event, update);
  }

  async launch(request: Request) {
    const url = new URL(request.url);
    if (`/${this.token}` === url.pathname) {
      if (request.method === "POST") {
        const json = (await request.json()) as Update;
        if (json) {
          await this.update(json);
        }
      }
    }
  }
}
