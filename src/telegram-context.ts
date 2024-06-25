import {
  SendMessage,
  Update,
  InlineQueryResult,
  AnswerInlineQuery,
  SendPhoto,
} from "telegram-typings";
import { TelegramApi } from "./telegram-api";

export class TelegramContext {
  private readonly api: TelegramApi;
  update: Update;

  constructor(token: string, update: Update) {
    this.api = new TelegramApi(token);
    this.update = update;
  }

  async sendMessage(
    chat_id: number,
    text: string,
    extra?: Omit<SendMessage, "chat_id" | "text">
  ) {
    return await this.api.sendMessage({
      chat_id,
      text,
      ...extra,
    });
  }

  async reply(text: string, extra?: Omit<SendMessage, "chat_id" | "text">) {    
    return await this.api.sendMessage({
      chat_id: this.update.message.chat.id,
      text,
      ...extra,
    });
  }

  async answerInlineQuery(
    results: InlineQueryResult[],
    extra?: Omit<AnswerInlineQuery, "results">
  ) {
    return await this.api.answerInlineQuery({
      inline_query_id: this.update.inline_query.id,
      results,
      ...extra,
    });
  }

  async sendPhoto(chat_id: number, photo: string, extra?: Omit<SendPhoto, 'photo'>) {
    return await this.api.sendPhoto({
      chat_id,
      photo,
      ...extra,
    })
  }

  async getMe() {
    return await this.api.getMe();
  }
}
