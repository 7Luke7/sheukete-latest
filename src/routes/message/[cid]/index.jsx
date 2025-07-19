import { createAsync } from "@solidjs/router";
import { get_messages } from "~/routes/api/messages/main";
import { ConvoHeader } from "../Components/ConvoHeader";
import { Chat } from "./Chat";

const Message = (props) => {
  const response = createAsync(() => get_messages(props.params.cid), { deferStream: true });

  return (
    <Show when={response()}>
      <div class="overflow-hidden">
        <ConvoHeader
          prof_id={response().prof_id}
          firstname={response().firstname}
          lastname={response().lastname}
          role={response().role}
        ></ConvoHeader>
        <Chat response={response}></Chat>
      </div>
    </Show>
  );
};

export default Message;
