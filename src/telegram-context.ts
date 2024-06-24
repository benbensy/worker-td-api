import {
  SendMessage,
  Update,
  InlineQueryResult,
  AnswerInlineQuery,
} from "telegram-typings";
import { TelegramApi } from "./telegram-api";

export class TelegramContext {
  private readonly api: TelegramApi;
  update: Update;

  constructor(token: string, update: Update) {
    this.api = new TelegramApi(token);
    this.update = update;
  }

  sendMessage(
    chat_id: number,
    text: string,
    extra?: Omit<SendMessage, "chat_id" | "text">
  ) {
    return this.api.sendMessage({
      chat_id,
      text,
      ...extra,
    });
  }

  reply(text: string, extra?: Omit<SendMessage, "chat_id" | "text">) {
    return this.api.sendMessage({
      chat_id: this.update.message.chat.id,
      text,
      ...extra,
    });
  }

  answerInlineQuery(
    results: InlineQueryResult[],
    extra?: Omit<AnswerInlineQuery, "results">
  ) {
    return this.api.answerInlineQuery({
      inline_query_id: this.update.inline_query.id,
      results,
      ...extra,
    });
  }
}
