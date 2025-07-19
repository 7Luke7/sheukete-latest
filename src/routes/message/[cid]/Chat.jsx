import { Image } from "../Components/Image";
import { Text } from "../Components/Text";
import filePreview from "../../../svg-images/file-preview.svg";
import loader from "../../../svg-images/loader.svg";
import { formatFileSize, send_message_to_server, validateFile } from "../Components/utils";
import { MessageForm } from "../Components/MessageForm";
import { createEffect, For, Show, createSignal, Match, on, onCleanup, Switch, useContext, onMount } from "solid-js";
import { WSContext } from "~/wscontext";
import { Toast } from "~/Components/ToastComponent";
import closeIcon from "../../../svg-images/svgexport-12.svg";
import { get_image_based_on_size } from "~/Components/utils";
import LeftArrow from "../../../svg-images/ChevronLeftBlack.svg";
import RightArrow from "../../../svg-images/ChevronRightBlack.svg";
import { createVirtualizer } from "~/Components/virtualizer/vr";
import { isServer } from "solid-js/web";
import { createStore } from "solid-js/store";
import { send_text } from "~/routes/api/messages/main";

export const Chat = (props) => {
    const { response } = props;
    const [loading, setLoading] = createSignal(false);
    const [value, setValue] = createSignal("");
    const [modalValue, setModalValue] = createSignal("");
    const [preparedFiles, setPreparedFiles] = createSignal([])
    const [modal, setModal] = createSignal(false)
    const [toast, setToast] = createSignal(null);
    const [carouselImages, setCarouselImages] = createSignal()
    const [virtualMessagesStore, setVirtualMessagesStore] = createStore({
        messages: []
    })

    const ctx = useContext(WSContext);
    const MAX_TOTAL_SIZE = 200 * 1024 * 1024;
    let ws
    let parentRef = null
    let chatWrapper = null

    onMount(() => {
        requestAnimationFrame(() => {
            parentRef.scrollTop = parentRef.scrollHeight
        })
        if (!virtualMessagesStore.messages.length) {
            setVirtualMessagesStore("messages", response().convos)
            new createVirtualizer(parentRef, virtualMessagesStore, setLoading, setVirtualMessagesStore, chatWrapper, response().conversation_id).render()
        }
        if (ctx()) ws = ctx().ws
        const retreive_message = (event) => {
            const { channel, ...rest } = JSON.parse(event.data);
            if (channel === `convo:${response()?.conversation_id}`) {
                setVirtualMessagesStore("messages", virtualMessagesStore.messages.length, { ...rest })
                requestAnimationFrame(() => {
                    parentRef.scrollTop = parentRef.scrollHeight
                })
            }
        }
        ws.addEventListener("message", retreive_message)

        onCleanup(() => {
            ws.removeEventListener("message", retreive_message)
        })
    })
    const send_message = async () => {
        if (!ws) return console.log("Websocket not connected")
        const derived_value = value().length ? value() : modalValue()
        const type = (!derived_value.length && preparedFiles().length) ? "file" :
            (derived_value.length && !preparedFiles().length) ? "text" :
                (derived_value.length && preparedFiles().length) && "text-file"
        switch (type) {
            case "text":
                const text_response = await send_text({
                    content: derived_value,
                    date: new Date(),
                    convo_id: response().conversation_id,
                    receiver_prof_id: response().receiver_prof_id
                })
                if (text_response !== 200) {
                    return console.log("something is wrong")
                }
                ws.send(JSON.stringify({
                    type: "message",
                    content: derived_value,
                    message_content_type: ["text"],
                    created_at: new Date(),
                    convo_id: response().conversation_id,
                    sender_id: response().my_id
                }))
                if (modal()) setModal(false)
                if (value().length) setValue("")
                else setModalValue("")
                break;
            case "file":
                let summed_bytes = 0;
                let formData = new FormData();

                formData.append("file_count", preparedFiles().length)
                formData.append("convo_id", response().conversation_id)
                formData.append("receiver_prof_id", response().receiver_prof_id)
                formData.append("date", new Date().toISOString())
                let meta_index = 0
                for (let i = 0; i < preparedFiles().length; i++) {
                    const pf = preparedFiles()[i].file;
                    const fileBytes = pf.size;

                    if (summed_bytes + fileBytes >= (MAX_TOTAL_SIZE / 4)) {
                        formData.set("file_count", i)
                        await send_message_to_server(formData, response, ws);
                        formData = new FormData();
                        formData.append("convo_id", response().conversation_id)
                        formData.append("receiver_prof_id", response().receiver_prof_id)
                        formData.set("file_count", preparedFiles().length - i)
                        formData.append("date", new Date().toISOString())
                        summed_bytes = 0;
                        meta_index = 0
                    }

                    const id = crypto.randomUUID();
                    summed_bytes += fileBytes;
                    formData.append(`meta-${meta_index}`, JSON.stringify({
                        id,
                        size: pf.size,
                        name: pf.name,
                        content_type: pf.type
                    }));

                    formData.append(`file|id:${id}`, pf);
                    meta_index++
                }

                if (summed_bytes > 0) {
                    await send_message_to_server(formData, response, ws);
                }
                if (modal()) {
                    setPreparedFiles([])
                    setModal(false)
                    setModalValue("")
                }
                break;
            case "text-file":
                const text_file_formData = new FormData()
                /* 
                    we could check amount of files and send certain amount's of bytes say user wants to upload
                    100mb files 10mb each we would say make 1 request for 50mb
                    then another 50mb for other's left this way we will be sending to websocket way faster
                    and we will have lower amounts of files sent as well
                */
                preparedFiles().forEach((pf, i) => {
                    const id = crypto.randomUUID()
                    text_file_formData.append(`file|id:${id}`, pf.file)

                    text_file_formData.append(`meta-${i}`, JSON.stringify({
                        id, size: pf.file.size, name: pf.file.name, content_type: pf.file.type
                    }))
                })
                text_file_formData.append("content", derived_value)
                text_file_formData.append("file_count", preparedFiles().length.toString())
                text_file_formData.append("convo_id", response().conversation_id)
                text_file_formData.append("receiver_prof_id", response().receiver_prof_id)
                text_file_formData.append("date", new Date().toISOString())

                const file_text_message_response = await fetch("/api/messages/main", {
                    method: "POST",
                    credentials: "include",
                    body: text_file_formData
                })

                const file_text_data = await file_text_message_response.json()
                if (file_text_message_response.status === 200) {
                    ws.send(JSON.stringify({
                        type: "message",
                        content: derived_value,
                        message_content_type: file_text_data.type,
                        file_metadata: file_text_data.file_metadata,
                        created_at: file_text_data.created_at,
                        convo_id: response().conversation_id,
                        sender_id: response().my_id
                    }))
                }
                if (modal()) {
                    setPreparedFiles([])
                    setModal(false)
                    setModalValue("")
                }
                break;
        }
        requestAnimationFrame(() => {
            parentRef.scrollTop = parentRef.scrollHeight
        })
    };

    let summedSize = 0

    const previewImage = (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return
        for (const file of files) {
            const response = validateFile(file)
            if (!response.valid) {
                setToast({
                    type: false,
                    message: response.reason
                })
                return;
            }
            summedSize += file.size
            if (summedSize > MAX_TOTAL_SIZE) {
                setToast({ type: false, message: `ფაილების ზომის ლიმიტი მიღწეულია.` })
                return
            }
            setPreparedFiles((prev) => {
                return [
                    ...prev,
                    {
                        ...(response.type === "image" && { url: URL.createObjectURL(file) }),
                        file
                    }
                ]
            })
        }

        if (!modal()) setModal(true)
        if (value().length) {
            setModalValue(value())
            setValue("")
        }
    }

    const add_overlay = (prop) => {
        const blurOverlay = document.createElement("div");
        blurOverlay.id = "blur-overlay";
        blurOverlay.style.position = "fixed";
        blurOverlay.style.top = "0";
        blurOverlay.style.left = "0";
        blurOverlay.style.width = "100vw";
        blurOverlay.style.height = "100vh";
        blurOverlay.style.backdropFilter = "blur(0.9px)";
        blurOverlay.style.backgroundColor = prop === "carousel" ? "rgba(0, 0, 0, 0.2)" : "rgba(255,255,255,0.05)";
        blurOverlay.style.zIndex = "55";
        document.body.append(blurOverlay)
    }
    const remove_overlay = () => {
        const blur = document.getElementById("blur-overlay")
        document.body.removeChild(blur)
    }
    createEffect(on(modal, () => {
        if (modal()) {
            add_overlay("modal")
        } else {
            remove_overlay()
        }
    }, { defer: true }))

    console.log(response())
    return (
        <>
            <Show when={modal()}>
                <div class="absolute top-1/2 z-[80] -translate-y-1/2 -translate-x-1/2 left-1/2 w-[460px] rounded-2xl bg-white">
                    <div class="flex px-4 items-center justify-between border-b py-2">
                        <p class="font-bold font-[thin-font] text-md">დაამატე ფოტოები</p>
                        <button onClick={() => {
                            setModal(false)
                            setValue(modalValue())
                            setModalValue("")
                            setPreparedFiles([])
                        }} class="absolute p-1 rounded-full top-1 right-1">
                            <img src={closeIcon} width={26} height={26}></img>
                        </button>
                    </div>
                    <div class="flex flex-col gap-y-2 py-2 px-4 h-[288px] overflow-y-auto">
                        <For each={preparedFiles()}>
                            {(pf, i) => (
                                <div class="w-full relative">
                                    <Switch>
                                        <Match when={pf.file.type.startsWith("image/")}>
                                            <button onClick={() => setPreparedFiles((prev) => {
                                                if (prev.length === 1) {
                                                    setModal(false)
                                                    setValue(modalValue())
                                                    setModalValue("")
                                                    return []
                                                }
                                                return prev.filter((_, index) => index !== i())
                                            })} class="opacity-80 absolute bg-gray-50 p-1 rounded-full top-1 right-1">
                                                <img src={closeIcon} width={14} height={14}></img>
                                            </button>
                                            <img height={192} class="object-cover border w-full h-[192px] rounded-lg" src={pf.url}></img>
                                        </Match>
                                        <Match when={!pf.file.type.startsWith("image/")}>
                                            <div class="flex rounded-lg py-1 px-2 bg-gray-100 justify-between items-center w-full">
                                                <div class="flex gap-x-3">
                                                    <img src={filePreview} width={36} height={36}></img>
                                                    <div class="flex flex-col gap-x-2">
                                                        <p class="font-bold font-[thin-font] text-sm text-gray-800">{pf.file.name.slice(0, 35)}...</p>
                                                        <p class="font-bold font-[thin-font] text-xs text-gray-500">{formatFileSize(pf.file.size)}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setPreparedFiles((prev) => {
                                                    if (prev.length === 1) {
                                                        setModal(false)
                                                        setValue(modalValue())
                                                        setModalValue("")
                                                        return []
                                                    }
                                                    return prev.filter((_, index) => index !== i())
                                                })} class="bg-gray-200 p-1 rounded-full">
                                                    <img src={closeIcon} width={14} height={14}></img>
                                                </button>
                                            </div>
                                        </Match>
                                    </Switch>
                                </div>
                            )}
                        </For>
                    </div>
                    <MessageForm
                        value={modalValue}
                        setValue={setModalValue}
                        send_message={send_message}
                        previewImage={previewImage}
                        scenario="modal"
                    ></MessageForm>
                </div>
            </Show>
            <Show when={carouselImages()}>
                <button onClick={() => {
                    setCarouselImages(null)
                    remove_overlay()
                }} class="cursor-pointer absolute top-3 right-5 z-[102]">
                    <img src={closeIcon} width={40} height={40}></img>
                </button>
                <div class="absolute top-1/2 left-1/2 -translate-y-1/2 z-[101] -translate-x-1/2">
                    <img src={`http://localhost:5555${get_image_based_on_size(carouselImages().find(ci => ci.on_display === true).url, "large")}`}></img>
                </div>
                <button disabled={carouselImages().length < 2} onClick={() => {
                    const currentIndex = carouselImages().findIndex(a => a.on_display);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : carouselImages().length - 1;

                    setCarouselImages(prev =>
                        prev.map((img, i) => ({
                            ...img,
                            on_display: i === prevIndex
                        }))
                    );
                }} class="cursor-pointer z-[102] absolute top-1/2 left-0 -translate-y-1/2">
                    <img src={LeftArrow} width={64} height={64}></img>
                </button>
                <button disabled={carouselImages().length < 2} onClick={() => {
                    const currentIndex = carouselImages().findIndex(a => a.on_display === true)
                    const nextIndex = currentIndex + 1 === carouselImages().length ? 0 : currentIndex + 1
                    setCarouselImages(prev => {
                        return prev.map((img, i) => ({
                            ...img,
                            on_display: nextIndex === i
                        }))
                    })
                }} class="cursor-pointer absolute z-[102] top-1/2 right-0 -translate-y-1/2">
                    <img src={RightArrow} width={64} height={64}></img>
                </button>
            </Show>
            <div
                ref={(el) => (parentRef = el)}
                class="bg-gray-200 flex flex-col overflow-y-auto"
                style={{ height: "calc(94vh - 55px)" }}
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
                    <div
                        class="flex w-[65%] flex-col mx-auto" ref={el => (chatWrapper = el)}>
                        <For each={isServer ? response().convos : virtualMessagesStore.messages}>
                            {(message, i) => (
                                <div
                                    index={i()}
                                    last-message-id={
                                        virtualMessagesStore.messages.length - i() < 20 ? message.message_id
                                        : ((virtualMessagesStore.messages.length - i()) % 20) === 0 ? message.message_id : undefined
                                    }
                                    class={`flex w-full py-2 items-center ${message.is_echo || response().my_id === message.sender_id
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
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
                                                                <Match when={fm.content_type === "video"}>
                                                                    <div class="h-[200px] w-full">video placeholder</div>
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
                            )}
                        </For>
                    </div>
                </Show>
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
            <Show when={toast()}>
                <Toast toast={toast} setToast={setToast}></Toast>
            </Show>
        </>
    );
}