# worker-td-api

telegram api for cloudflare workers

## Usage

- `npm create cloudflare@latest`
- `npx wrangler login`
- `npx wrangler secret put SECRET_TELEGRAM_API_TOKEN`, set it to your telegram bot token that you got from `@BotFather`
- `npx wrangler deploy`
- Open this url in your browser to set your webhook `https://api.telegram.org/bot${SECRET_TELEGRAM_API_TOKEN}/setWebhook?url=${YOUR_WORKER_URL}/${SECRET_TELEGRAM_API_TOKEN}`

## Example

```typescript
import TDBot from "worker-td-api";
export default {
  async fetch(request, env): Promise<Response> {
    const bot = new TDBot(env.SECRET_TELEGRAM_API_TOKEN);
    await bot
      .onMatch(/\?|？/, async (ctx) => {
        ctx.reply("谁问你了？");
      })
      .launch(request.clone());
  },
} satisfies ExportedHandler<Env>;
```
