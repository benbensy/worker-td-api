import { TelegramContext } from "./telegram-context";
import { Request } from "@cloudflare/workers-types";
import { Update } from "telegram-typings";

type EventType = "text" | "photo" | "inline" | "unknown";

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
      for await (const cb of this.eventPool.get(event)) {
        await cb(context);
      }
      return new Response("ok");
    }
  }

  onInlineQuery(fn: ContextFn): this {
    this.on("inline", fn);
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

  async update(update: Update) {
    const event = this.identifyEventType(update);
    return await this.emit(event, update);
  }

  async launch(request: Request) {
    const json = await request.json<Update>();
    const url = new URL(request.url);
    if (`/${this.token}` === url.pathname) {
      if (json) {
        await this.update(json);
      }
    }
  }
}
