// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { createClient } from 'redis';

export const client = createClient({
    url: "redis://default:Ep27vEVXXAm4EfawxPZY9dZGBq7CKb3S@redis-16978.c55.eu-central-1-1.ec2.redns.redis-cloud.com:16978"
})
client.on('error', err => console.log('Redis Client Error', err));

await client.connect().then(() => console.log("successfuly connect")).catch((err) => {
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
