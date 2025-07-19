import { eventHandler } from "vinxi/http";

const start_ping_timeout = (peer) => {
  if (peer.timeoutId) {
    clearTimeout(peer.timeoutId);
  }

  peer.send(JSON.stringify({ channel: "ping" }));
  peer.is_alive = false;

  peer.timeoutId = setTimeout(() => {
    if (!peer.is_alive) {
      clearTimeout(peer.timeoutId);
      for (const channel of peer.subscriptions) {
        if (channel === `status:${peer.profId}`) {
          peer.publish(channel, JSON.stringify({
            channel: 'status',
            content: 'offline',
            ts: new Date()
          }))
        }
        peer.unsubscribe(channel);
      }
      peer.terminated = true
      peer.terminate();
    } else {
      clearTimeout(peer.timeoutId);
      start_ping_timeout(peer);
    }
  }, 30000);
};

const unseen_notifications = new Map()

export default eventHandler({
  handler() { },
  websocket: {
    async open(peer) {
      try {
        peer.is_alive = true
        peer.subscriptions = new Set()
        peer.timeoutId = null
      } catch (error) {
        console.log(error)
      }
    },

    async message(peer, message) {
      if (peer.terminated) return;
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
            if (!profId) return // we can alternatively close the ws conection?!
            peer.profId = profId
            peer.subscribe(`status:${profId}`)
            peer.subscribe(`unseen-notification:${profId}`)
            peer.subscriptions.add(`status:${profId}`)
            peer.publish(`status:${profId}`, JSON.stringify({
              content: 'online',
              channel: "status",
              ts: Date.now()
            }))
            start_ping_timeout(peer)
            break;
          case "convo":
            if (data.action === "join") {
              data.convo?.forEach((convoId) => {
                peer.subscribe(`convo:${convoId}`);
                peer.subscriptions.add(`convo:${convoId}`)
              });
            } else if (data.action === "leave") {
              close(peer, data)
            }
            break;
          case "message":
            const object = {
              ...(data.message_content_type[0] === "text" && { content: data.content }),
              ...(data.message_content_type[0] === "file" && { file_metadata: data.file_metadata }),
              ...(data.message_content_type.length > 1 && { file_metadata: data.file_metadata, content: data.content }),
              type: data.message_content_type,
              channel: `convo:${data.convo_id}`,
              created_at: data.created_at,
              sender_id: data.sender_id
            }
            peer.publish(`convo:${data.convo_id}`, JSON.stringify(object))
            peer.send(JSON.stringify({ ...object, is_echo: true }));
            break;
          case "typing":
            peer.subscribe(`typying:${data.convo_id}`)
            break;
          case "check_others":
            peer.subscribe(`status:${data.profId}`)
            peer.subscriptions.add(`status:${data.profId}`)
            peer.publish(`status:${data.profId}`, JSON.stringify({
              channel: "status",
              type: "update_status"
            }))
            break;
          case "pong":
            peer.is_alive = true
            break;
          case "share_status_update":
            // we will have subscriptions saved based on user profile id 
            // its necessary to track because when users disconnect from certain
            // we will unsub from there so here we will run Subscriptions.has(profId?)
            peer.publish(`status:${peer.profId}`, JSON.stringify({
              content: 'online',
              channel: "status",
              ts: Date.now()
            }))
            break;
          case "unseen-notification":
            switch (data.action) {
              case "clear":
                if (unseen_notifications.has(peer.profId)) {
                  unseen_notifications.delete(peer.profId)
                }
                peer.send(JSON.stringify({
                  channel: "unseen-notification",
                  notification: null
                }))
                break;
              case "add":
                if (data.is_echo) {
                  if (!unseen_notifications.has(peer.profId)) {
                    unseen_notifications.set(data.profId, [data.notification])
                  } else {
                    unseen_notifications.set(peer.profId, [data.notification, ...unseen_notifications.get(peer.profId)])
                  }
                } else {
                  if (!unseen_notifications.has(data.profId)) {
                    unseen_notifications.set(data.profId, [data.notification])
                  } else {
                    unseen_notifications.set(data.profId, [data.notification, ...unseen_notifications.get(data.profId)])
                  }
                  peer.publish(`unseen-notification:${data.profId}`, JSON.stringify({
                    notification: {
                      ...data.notification,
                      prof_id: peer.profId,
                      action: "add",
                    },
                    channel: "unseen-notification"
                  }))
                }
                break;
              case "delete":
                if (data.is_echo) {
                  if (!unseen_notifications.has(peer.profId)) return console.log("No recent notifications to delete!")
                  const updated_recent_notifiactions = unseen_notifications.get(peer.profId).filter((n) => n.id !== data.id)
                  unseen_notifications.set(peer.profId, updated_recent_notifiactions)
                  console.log(updated_recent_notifiactions)
                  if (!updated_recent_notifiactions.length) peer.send(JSON.stringify({
                    channel: "unseen-notification",
                    notification: null
                  }))
                  if (data.notification?.type) {
                    peer.publish(`unseen-notification:${data.target_prof_id}`, JSON.stringify({
                      channel: "unseen-notification",
                      notification: {
                        ...data.notification,
                        action: "add",
                      }
                    }))
                  }
                } else {
                  if (!unseen_notifications.has(data.profId)) return console.log("User is not subscribed to channel!")
                  const updated_recent_notifiactions = unseen_notifications.get(data.profId).filter((n) => n.id !== data.id)
                  unseen_notifications.set(data.profId, updated_recent_notifiactions)
                  peer.publish(`unseen-notification:${data.profId}`, JSON.stringify({
                    notification: {
                      id: data.id,
                      action: "delete"
                    },
                    channel: "unseen-notification",
                  }))
                }
                break;
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error)
      }
    },
    async close(peer, details) {
      try {
        if (peer.timeoutId) {
          clearTimeout(peer.timeoutId);
        }
        for (const channel of peer.subscriptions) {
          if (channel === `status:${peer.profId}`) {
            peer.publish(channel, JSON.stringify({
              channel: 'status',
              content: 'offline',
              ts: new Date()
            }))
          }
          peer.unsubscribe(channel);
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
})