import { AnswerInlineQuery, SendMessage, SendPhoto } from "telegram-typings";

export class TelegramApi {
  private readonly baseUrl: string;

  constructor(token: string) {
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  private async callApi(path: string, data?: object) {
    await fetch(this.baseUrl + path, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  private async callGetApi<T extends object>(path: string): Promise<T> {
    const res = await fetch(this.baseUrl + path)    
    const json = await res.json()
    return json
  }

  async sendMessage(payload: SendMessage) {    
    return await this.callApi("/sendMessage", payload);
  }

  async answerInlineQuery(payload: AnswerInlineQuery) {
    return await this.callApi("/answerInlineQuery", payload);
  }

  async sendPhoto(payload: SendPhoto) {
    return await this.callApi('/sendPhoto', payload)
  }

  async getMe() {
    const json = await this.callGetApi('/getMe')
    return json
  }
}
