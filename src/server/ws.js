import { eventHandler } from "vinxi/http";

export const Subscriptions = new Set()

export default eventHandler({
  handler() { },
  websocket: {
    async open(peer) {
      try {

      } catch (error) {
        console.log(error)
      }
    },

    async message(peer, message) {
      try {
        const data = JSON.parse(message.text());
        switch (data.type) {
          case "INIT":
            const response = await fetch("http://localhost:3000/api/ws/wspecific", {
              headers: {
                'cookie': data.cookie,
              }
            })
            const { profId } = await response.json()
            if (!profId) return
            peer.subscribe(`status:${profId}`)
            peer.publish(`status:${profId}`, JSON.stringify({
              content: 'online',
            }))
            break;
          case "convo":
            if (data.action === "join") {
              data.convo?.forEach((convoId) => {
                peer.subscribe(`convo:${convoId}`);
              });
            } else if (data.action === "leave") {
              close(peer, data)
            }
            break;
          case "message":
            console.log(data)
            const object = {
              ...(data.message_content_type[0] === "text" && {content: data.content}),
              ...(data.message_content_type[0] === "file" && {file_metadata: data.file_metadata}),
              ...(data.message_content_type.length > 1 && {file_metadata: data.file_metadata, content: data.content}),
              type: data.message_content_type,
              channel: `convo:${data.convo_id}`,
              created_at: data.created_at,
              sender_id: data.sender_id
            }
            for (const key of peer.topics.entries()) {
              console.log(key)
            }
            peer.publish(`convo:${data.convo_id}`, JSON.stringify(object))
            peer.send(JSON.stringify({...object, is_echo: true}));
            break;
          case "typing":
            peer.subscribe(`typying:${data.convo_id}`)
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error)
      }
    },
    async close(code, reason) {
      try {
        if (code === 1001) {
          console.log("user left")
        }
      } catch (error) {
        console.log(error)
      }
    },
    async error(peer, error) {
      console.log("error: ", peer.id, peer.url, error);
    },
  },
})