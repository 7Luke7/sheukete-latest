// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { config } from "dotenv";
import { createClient } from 'redis';
config()
export const client = createClient({
    url: "redis://127.0.0.1:6379",
})

await client.connect().then(() => console.log("redis connected")).catch((err) => {
    console.log("REDIS_ERR: ", err)
})  

export default createHandler(() => (
    <StartServer
        document={({ assets, children, scripts }) => (
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                    {assets}
                </head>
                <body>
                    <div id="app">{children}</div>
                    {scripts}
                </body>
            </html>
        )}
        />
));
