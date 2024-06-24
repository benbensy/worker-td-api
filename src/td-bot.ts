import { Request } from "@cloudflare/workers-types";
import { TelegramBot } from "./telegram-bot";
import { Update } from "telegram-typings";

export class TDBot extends TelegramBot {
  async launch(request: Request) {
    const json = await request.json<Update>();
    this.update(json);
  }
}
