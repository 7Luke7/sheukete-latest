import { createSignal, For, Show, Match, Switch } from "solid-js";
import { Image } from "../Components/Image";
import { Text } from "../Components/Text";
import filePreview from "../../../svg-images/file-preview.svg";
import loader from "../../../svg-images/loader.svg";
import { formatFileSize } from "../Components/utils";
import { MessageForm } from "../Components/MessageForm";

export const Chat = (props) => {
    const {
        setCarouselImages,
        add_overlay,
        setValue,
        value,
        send_message,
        previewImage,
        response,
        setParentRef,
        virtualizer,
        messagesStore,
        virtualItems
    } = props;

    const [loading, setLoading] = createSignal(false);   

    return (
        <>
            <div
                ref={(el) => setParentRef(el)}
                class="bg-gray-200 relative overflow-y-auto"
                style={{ height: "calc(94vh - 55px)" }}
            >
                <div
                    class="relative bg-gray-200 w-[65%] mx-auto"
                    style={{ height: `${virtualizer?.getTotalSize() ?? 0}px` }}
                >
                    <Show
                        when={response().convos.length}
                        fallback={
                            <div class="flex items-center justify-center" style={{ height: "calc(94vh - 55px)" }}>
                                <p class="text-lg text-gray-800 font-[normal-font]">
                                    თქვენს და {response().firstname}-ს შორის მიმოწერები არ არის.
                                </p>
                            </div>
                        }
                    >
                        <div
                            class="absolute w-full"
                            style={{
                                transform: `translateY(${virtualItems()[0]?.start ?? 0}px)`,
                            }}
                        >
                            <For each={virtualItems()}>
                                {({ index }) => {
                                    const message = messagesStore.messages[index] || response().convos[index];

                                    return (
                                        <div
                                            attr:data-index={index}
                                            ref={(el) => {
                                                el.dataset.index = index;
                                                queueMicrotask(() => virtualizer?.measureElement(el));
                                            }}
                                            class={`flex w-full py-2 items-center ${message.is_echo || response().my_id === message.sender_id
                                                ? "justify-end"
                                                : "justify-start"
                                                }`}
                                        >
                                            <div
                                                id={`echo-message-actions-${message.message_id}`}
                                                class="hidden items-center gap-x-2 pr-2"
                                            ></div>
                                            <div class="overflow-hidden max-w-[45%] rounded-r-xl min-w-[120px] bg-white relative rounded-bl-lg rounded-tl-3xl">
                                                <Switch>
                                                    <Match when={message.type.length > 1}>
                                                        <div class="flex flex-col">
                                                            <div class="flex flex-wrap w-full">
                                                                <For each={message.file_metadata}>
                                                                    {(fm, i) => (
                                                                        <Switch>
                                                                            <Match when={fm.content_type === "image"}>
                                                                                <Image
                                                                                    setCarouselImages={setCarouselImages}
                                                                                    add_overlay={add_overlay}
                                                                                    message={message}
                                                                                    i={i}
                                                                                    fm={fm}
                                                                                />
                                                                            </Match>
                                                                        </Switch>
                                                                    )}
                                                                </For>
                                                            </div>
                                                            <Text message={message} />
                                                        </div>
                                                    </Match>
                                                    <Match when={message.type[0] === "text"}>
                                                        <Text message={message} />
                                                    </Match>
                                                    <Match when={message.type[0] === "file"}>
                                                        <div class="flex inner-div flex-wrap w-full">
                                                            <For each={message.file_metadata}>
                                                                {(fm, i) => (
                                                                    <Switch>
                                                                        <Match when={fm.content_type === "image"}>
                                                                            <Image
                                                                                setCarouselImages={setCarouselImages}
                                                                                add_overlay={add_overlay}
                                                                                message={message}
                                                                                i={i}
                                                                                fm={fm}
                                                                            />
                                                                        </Match>
                                                                        <Match when={fm.content_type === "document"}>
                                                                            <div class="flex bg-gray-200 rounded w-full my-1 mx-2">
                                                                                <img
                                                                                    src={filePreview}
                                                                                    width={36}
                                                                                    height={36}
                                                                                />
                                                                                <div class="flex flex-col gap-x-2">
                                                                                    <p class="font-bold font-[thin-font] text-sm text-gray-800">
                                                                                        {fm.name.slice(0, 35)}...
                                                                                    </p>
                                                                                    <p class="font-bold font-[thin-font] text-xs text-gray-500">
                                                                                        {formatFileSize(fm.size)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </Match>
                                                                    </Switch>
                                                                )}
                                                            </For>
                                                        </div>
                                                    </Match>
                                                </Switch>
                                                <p class="text-xs absolute bottom-1 right-2 font-[thin-font] font-bold text-gr">
                                                    {new Date(message.created_at).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }}
                            </For>
                            <Show when={loading()}>
                                <div class="flex justify-center pt-2">
                                    <img
                                        src={loader}
                                        width={24}
                                        height={24}
                                        class="animate-spin"
                                    />
                                </div>
                            </Show>
                        </div>
                    </Show>
                </div>
            </div>
            <div class="flex items-center h-[60px] justify-center">
                <MessageForm
                setValue={setValue}
                value={value}
                send_message={send_message}
                previewImage={previewImage}
                scenario="normal"
            ></MessageForm>
            </div>
            </>
    );
}