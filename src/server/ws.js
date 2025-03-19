import { eventHandler } from "vinxi/http";

export default eventHandler({
  handler() {},
  websocket: {
    async open(peer) {
      try {
        console.log(peer.id)
      } catch (error) {
        console.log(error)
      }
    },
  
    async message(peer, message) {
      try {
        const data = JSON.parse(message.text());
  
        console.log(data)
        switch (data.type) {
          case "status":
            peer.subscribe(`status:${data.profId}`)
            break;
        
          default:
            break;
        }
  
        peer.subscribe(data.convo_id)

        peer.publish(
          data.convo_id,
          JSON.stringify({
            type: "message",
            convo_id: data.convo_id,
            message: data.message,
            sender: peer.id,
          })
        )
      } catch (error) {
        console.error("Message handling error:", error);
        peer.send(JSON.stringify({
          type: "error",
          message: error.message
        }));
      }
    },
    async close(peer, message) {
      // const convo_id = text(peer.message)
      // console.log(convo_id)
      console.log("close", peer.id);
      // peer.unsubscribe(convo_id)
    },
    async error(peer, error) {
      console.log("error", peer.id, peer.url, error);
    },
  },
});
