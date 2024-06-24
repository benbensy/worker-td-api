import { AnswerInlineQuery, SendMessage } from "telegram-typings";

export class TelegramApi {
  private readonly baseUrl: string;

  constructor(token: string) {
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  private async callApi(path: string, data: object) {
    return await fetch(this.baseUrl + path, {
      method: "POST",
      headers: {
        "Content-type": "application/json;utf-8",
      },
      body: JSON.stringify(data),
    });
  }

  async sendMessage(payload: SendMessage) {
    this.callApi("/sendMessage", payload);
  }

  async answerInlineQuery(payload: AnswerInlineQuery) {
    this.callApi("/answerInlineQuery", payload);
  }
}
