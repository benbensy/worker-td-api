import {
  SendMessage,
  Update,
  InlineQueryResult,
  AnswerInlineQuery,
  SendPhoto,
  SendAudio,
  InputFile,
  ForwardMessage,
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

  async sendPhoto(
    chat_id: number,
    photo: string | InputFile,
    extra?: Omit<SendPhoto, "chat_id" | "photo">
  ) {
    return await this.api.sendPhoto({
      chat_id,
      photo,
      ...extra,
    });
  }

  async sendAudio(
    chat_id: number,
    audio: string,
    extra?: Omit<SendAudio, "chat_id" | "audio">
  ) {
    return await this.api.sendAudio({
      chat_id,
      audio,
      ...extra,
    });
  }

  async forwardMessage(
    chat_id: number,
    from_chat_id: number,
    message_id: number,
    extra?: Omit<ForwardMessage, "chat_id">
  ) {
    return await this.api.forwardMessage({
      chat_id,
      from_chat_id,
      message_id,
      ...extra,
    });
  }

  async getMe() {
    return await this.api.getMe();
  }
}
