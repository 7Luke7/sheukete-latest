import { createAsync } from "@solidjs/router";
import { get_messages } from "~/routes/api/messages/main";
import { ConvoHeader } from "../Components/ConvoHeader";
import { createEffect, createSignal, on} from "solid-js";
import attachIcon from "../../../svg-images/paperclip.svg";
import emojiIcon from "../../../svg-images/emoji-smile.svg";
import sendIcon from "../../../svg-images/send-message.svg";

const Message = (props) => {
  const messages = createAsync(() => get_messages(props.params.cid));
  const [value, setValue] = createSignal("");
  let wrapperDiv;

  createEffect(
    on(
	  value,
      () => {
        
      },
      { defer: true }
    )
  );

  const send_message = (message) => {
  };

  return (
    <Show when={messages()}>
      <ConvoHeader
        prof_id={messages().prof_id}
        firstname={messages().firstname}
        lastname={messages().lastname}
        role={messages().role}
      ></ConvoHeader>
      <div class="bg-gray-200 h-[calc(100vh-85px)]">
        <div class="flex flex-col w-[50%] h-full py-5 mx-auto">
          <div class="h-[94%]">
            <Show
              fallback={
                <div class="items-center justify-center flex h-full">
                  <p class="font-[normal-font] text-gray-800 text-lg">
                    თქვენს და {messages().firstname}-ს შორის მიმოწერები არ არის.
                  </p>
                </div>
              }
              when={messages().convos.length}
            >
              <For each={messages().convos}>
                {(message) => (
                  <div
                    class={`flex ${
                      message.is_sender ? "justify-end" : "justify-start"
                    } py-2`}
                  >
                    <div class="px-2 py-2 max-w-[40%] rounded-r-xl min-w-[120px] bg-white relative rounded-bl-lg rounded-tl-3xl">
                      <p
                        class="text-gray-800 break-words font-[normal-font] text-sm mb-2"
                        style={{ "overflow-wrap": "break-word" }}
                      >
                        {message.text}
                      </p>
                      <p class="text-xs absolute bottom-1 right-2 text-gr font-[thin-font] font-bold">
                        {message.time}
                      </p>
                    </div>
                  </div>
                )}
              </For>
            </Show>
          </div>
          <div class="h-auto w-full mt-3 flex gap-x-4">
            <div
              ref={wrapperDiv}
              class="w-full gap-x-3 bg-white flex px-4 py-2 rounded-lg items-center"
            >
              <button>
                <img width={24} height={24} src={emojiIcon} />
              </button>
              <textarea
                placeholder="მესიჯი"
                style={{ resize: "none" }}
                class="text-gray-800 w-full max-h-[120px] overflow-y-auto py-1 font-[normal-font] text-sm outline-none"
                value={value()}
                rows={1}
                onInput={(e) => {
                  setValue(e.target.value);
                  const textarea = e.target;
                  textarea.style.height = "auto";
                  textarea.style.height = `${Math.min(
                    textarea.scrollHeight,
                    120
                  )}px`;

                  if (textarea.scrollHeight > 28) {
                    wrapperDiv.style.alignItems = "end";
                  } else {
                    wrapperDiv.style.alignItems = "center";
                  }
                }}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						send_message(value())
						setValue("")
						return
					}
				}}
              ></textarea>
              <button>
                <img width={24} height={24} src={attachIcon} />
              </button>
            </div>
            <Show when={value().length}>
              <button onClick={send_message} class="bg-white rounded px-4">
                <img width={24} height={24} src={sendIcon}></img>
              </button>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Message;
