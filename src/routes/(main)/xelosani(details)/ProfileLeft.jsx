import { Index, Match, createSignal, Show, Switch, batch, startTransition, createMemo, onMount, useContext, onCleanup } from "solid-js";
import location from "../../../svg-images/location.svg";
import telephone from "../../../svg-images/telephone.svg";
import envelope from "../../../svg-images/envelope.svg";
import CameraSVG from "../../../svg-images/camera.svg";
import pen from "../../../svg-images/pen.svg";
import cake from "../../../svg-images/cake.svg";
import spinnerSVG from "../../../svg-images/spinner.svg";
import { A } from "@solidjs/router";
import { makeAbortable } from "@solid-primitives/resource";
import { upload_image } from "~/routes/api/upload/images";
import { reject_request, accept_request } from "~/routes/api/friends/friends";
import { create_user_convos } from "~/routes/api/messages/conversations";
import { WSContext } from "~/wscontext";

export const ProfileLeft = (props) => {
  const [imageLoading, setImageLoading] = createSignal(false);
  const [imageUrl, setImageUrl] = createSignal();
  const [file, setFile] = createSignal();
  const [signal, abort, filterErrors] = makeAbortable({ timeout: 0, noAutoAbort: true });
  const [sendingFriendRequest, setSendingFriendRequest] = createSignal()
  const [friendRequest, setFriendRequest] = createSignal({
    friend_request_id: props.user().friend_request_id,
    friend_request_status: props.user().friend_request_status,
    is_sender: props.user().is_request_sender,
    notification_id: null
  })
  const [status, setStatus] = createSignal()

  const ctx = useContext(WSContext)
  const handleProfileImageChange = async () => {
    setImageLoading(true);
    const formData = new FormData();
    formData.append(`profile:${props.user().profId}`, file());

    try {
      const data = await upload_image(formData)

      if (data.status !== 200) {
        return props.setToast({
          type: false,
          message: data.message
        })
      }

      if (data.stepPercent === 100) {
        props.setToast({
          type: true,
          message: data.message
        })
      }
      batch(() => {
        setFile(null);
        props.setToast({
          type: true,
          message: data.message
        })
      });
    } catch (error) {
      if (error.name === "AbortError") {
        filterErrors(error);
      }
    } finally {
      setImageLoading(false);
    }
  };

  const handleFilePreview = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      return props.setToast({
        type: false,
        message: "ფაილის ზომა აღემატება 5მბ ლიმიტს."
      })
    }
    setImageLoading(true)
    try {
      batch(() => {
        setFile(file);
        setImageLoading(false);
        setImageUrl(URL.createObjectURL(file));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sendFriendRequest = async () => {
    setSendingFriendRequest(true)
    try {
      const response = await fetch("/api/friends/main", {
        method: "POST",
        body: JSON.stringify({ "targetId": props.user().profId, "role": props.user().role }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        signal: signal()
      })

      const data = await response.json()

      if (response.status === 200) {
        props.setToast({
          type: true,
          message: data.message
        })
        setFriendRequest(() => {
          return {
            friend_request_id: data.friend_request_id, friend_request_status: "pending", is_sender: true, notification_id: data.notification.id
          }
        })
        const ws = ctx()?.ws
        ws.send(JSON.stringify({
          type: "unseen-notification",
          action: "add",
          profId: props.user().profId,
          notification: {
            ...data.notification,
            friend_request_id: data.friend_request_id,
            friend_request_status: "pending",
          }
        }))
      } else {
        props.setToast({
          type: false,
          message: data.message
        })
        throw new Error("დაფიქსირდა შეცდომა მეგობრობის მოთხოვნის გაგზავნისას.")
      }
    } catch (error) {
      if (error.name === "AbortError") {
        filterErrors(error);
      }
    } finally {
      setSendingFriendRequest(false)
    }
  }

  const friend = createMemo(() => {
    if (sendingFriendRequest()) {
      return [{
        content: "გაუქმება",
        executable: () => abort()
      }]
    } else if (friendRequest().is_sender && friendRequest().friend_request_status === "pending") {
      return [
        {
          content: "მოთხოვნის გაუქმება",
          executable: async () => {
            try {
              const response = await reject_request(friendRequest().friend_request_id, props.user().viewer_role, friendRequest().friend_request_status)
              if (response === 200) {
                const ws = ctx().ws
                ws?.send(JSON.stringify({
                  type: "unseen-notification",
                  profId: props.user().profId,
                  action: "delete",
                  id: friendRequest().notification_id
                }))
                setFriendRequest((prev) => {
                  return {
                    ...prev,
                    notification_id: null,
                    friend_request_status: null,
                    is_sender: false
                  }
                })
              } else {
                throw new Error("მეგობრის დამატება ვერ მოხერხდა")
              }
            } catch (error) {
              console.log(error)
            }
          }
        }
      ]
    } else if (!friendRequest().is_sender && friendRequest().friend_request_status === "pending") {
      return [{
        executable: async () => {
          try {
            const response = await accept_request(props.user().notification_id, friendRequest().friend_request_id, friendRequest().friend_request_status)
            if (response === 200) {
              const ws = ctx().ws
              setFriendRequest((prev) => {
                return {
                  ...prev,
                  friend_request_status: "accepted",
                  is_sender: false
                }
              })
              ws?.send(JSON.stringify({
                type: "unseen-notification",
                profId: props.user().profId,
                action: "delete",
                id: friendRequest().notification_id
              }))
            } else {
              throw new Error("მეგობრის დამატება ვერ მოხერხდა")
            }
          } catch (error) {
            console.log(error)
          }
        },
        content: "მეგობრობის დადასტურება"
      }, {
        executable: async () => {
          try {
            const response = await reject_request(props.user().notification_id, friendRequest().friend_request_id, friendRequest().friend_request_status)
            if (response === 200) {
              const ws = ctx().ws

              setFriendRequest((prev) => {
                return {
                  ...prev,
                  friend_request_status: "accepted",
                  is_sender: false
                }
              })
              ws?.send(JSON.stringify({
                type: "unseen-notification",
                action: "delete",
                id: n.id,
                target_prof_id: n.prof_id,
              }))
            } else {
              throw new Error("მეგობრის დამატება ვერ მოხერხდა")
            }
          } catch (error) {
            console.log(error)
          }
        },
        content: "მეგობრობის უარყოფა"

      }]
    } else if (friendRequest().friend_request_status === "accepted") {
      // should remove notifcation from header *send Websocket message*
      return [{
        content: "მეგობრობიდან წაშლა",
        executable: async () => {
          try {
            const response = await reject_request(friendRequest().friend_request_id, props.user().viewer_role, friendRequest().friend_request_status)
            if (response === 200) {
              const ws = ctx().ws
              setFriendRequest((prev) => {
                return {
                  ...prev,
                  friend_request_status: null,
                  is_sender: false
                }
              })
            } else {
              throw new Error("მეგობრის დამატება ვერ მოხერხდა")
            }
          } catch (error) {
            console.log(error)
          }
        }
      }]
    } else {
      return [{ executable: sendFriendRequest, content: "მეგობრობის გაგზავნა" }]
    }
  })

  const startConversation = async (prof_id, role) => {
    try {
      if (!prof_id) {
        throw new Error("პროფილის id სავალდებულოა.")
      }
      const response = await create_user_convos(prof_id, role)

      if (response.status === 200) {
        window.location.href = response.redirect_url
        return
      }
    } catch (error) {
      console.log(error)
    }
  }

  onMount(() => {
    if (!ctx()) return
    console.log(props.user().status)
    if (props.user().status !== 401) return
    const ws = ctx().ws
    ws.send(JSON.stringify({
      type: "check_others",
      profId: props.user().profId
    }))

    const check_status = (event) => {
      const data = JSON.parse(event.data)
      if (data.channel === "ping") return

      if (data.channel === "status") {
        setStatus({
          content: data.content
        })
      }
      /* TODO: 
      real time syncing users profile page friend state updates 
      it could be done later its not necessity for now
      */
      if (data.channel === "unseen-notification") {
          switch (data.notification?.type) {
            case "FRIEND_REQUEST_ACCEPTED":
              setFriendRequest((prev) => ({
                ...prev,
                friend_request_status: 'accepted',
              }))
              break;
            case "FRIEND_REQUEST_DECLINED":
              setFriendRequest(() => ({
                friend_request_id: null,
                friend_request_status: null,
                is_sender: null,
                notification_id: null
              }))
              break;
            case "FRIEND_REQUEST":
              setFriendRequest((prev) => ({
                ...prev,
                friend_request_id: data.notification.friend_request_id,
                friend_request_status: data.notification.friend_request_status,
                notification_id: data.notification.id
              }))
          }
      }
    }

    ws.addEventListener("message", check_status)

    onCleanup(() => {
      ws.removeEventListener("message", check_status)
    })
  })

  return (
    <div class="flex sticky top-[50px] gap-y-3 flex-col">
      <div class="relative flex flex-col min-w-[262px] items-center flex-[2] bg-white shadow-md rounded-lg p-6">
        <Switch>
          <Match when={props.user().status !== 401}>
            <Switch>
              <Match when={!imageLoading()}>
                <div>
                  <input
                    type="file"
                    name="profilePic"
                    class="hidden"
                    onChange={(e) => handleFilePreview(e.target.files[0])}
                    id="profilePic"
                    accept="image/webp, image/png, image/jpeg, image/jpg"
                  />
                  <label
                    for="profilePic"
                    class="hover:opacity-[0.7] cursor-pointer"
                  >
                    <div class="relative">
                      <img
                        loading="lazy"
                        id="prof_pic"
                        src={
                          imageUrl()
                            ? imageUrl()
                            : `http://localhost:5555/static/xelosani/profile/medium/${props.user().profId}.webp`
                        }
                        alt="profilis foto"
                        width={180}
                        height={180}
                        class="border-2 object-cover border-indigo-100 h-[180px] w-[180px] rounded-full my-2"
                      />
                      <img
                        loading="lazy"
                        src={CameraSVG}
                        alt="კამერის აიქონი"
                        class="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 opacity-50"
                      />
                      <span class="absolute bottom-2 right-6 w-5 h-5 bg-[#14a800] border-2 border-indigo-100 rounded-full"></span>
                    </div>
                  </label>
                </div>
                <Show when={file()}>
                  <button
                    onClick={handleProfileImageChange}
                    class="mb-2 bg-dark-green hover:bg-dark-green-hover text-white py-1 px-4 rounded-[16px] text-sm font-bold transition-all duration-300"
                  >
                    ფოტოს დაყენება
                  </button>
                </Show>
              </Match>
              <Match when={imageLoading()}>
                <div class="flex flex-col justify-center mb-4 items-center w-[180px] h-[180px] rounded-full bg-[#E5E7EB]">
                  <img
                    loading="lazy"
                    class="animate-spin"
                    src={spinnerSVG}
                    width={40}
                    height={40}
                    alt="იტვირთება"
                  />
                  <p class="text-dark-green font-[thin-font] text-xs font-bold">
                    იტვირთება...
                  </p>
                </div>
                <button
                  onClick={() => abort()}
                  class="mb-2 bg-gray-600 hover:bg-gray-500 w-[150px] text-white py-1 px-4 rounded-[16px] text-sm font-bold transition-all duration-300"
                >
                  გაუქმება
                </button>
              </Match>
            </Switch>
          </Match>
          <Match when={props.user().status === 401}>
            <div class="relative">
              <img
                loading="lazy"
                id="prof_pic"
                class="object-cover border-2 border-indigo-100 h-[180px] w-[180px] rounded-full my-2"
                src={`http://localhost:5555/static/xelosani/profile/medium/${props.user()?.profId}.webp`}
                alt="profilis foto"
                width={180}
                height={180}
              />
              <Show when={status()?.content === "online"}>
                <span class="absolute bottom-4 right-6 w-5 h-5 bg-[#14a800] border-2 border-indigo-100 rounded-full"></span>
              </Show>
            </div>
          </Match>
        </Switch>
        <h1 class="text-xl font-[boldest-font] text-gray-900">
          {props.user().firstname + " " + props.user().lastname}
        </h1>

        {/* User Details */}
        <div class="flex flex-col w-full justify-start mt-2 gap-y-2">
          <div class="flex pb-1 px-2 items-center gap-x-1">
            <Switch>
              <Match when={props.user().place_name_ka && props.user().privacy.location !== "დამალვა"}>
                <div class="flex items-center w-full gap-x-2">
                  <img loading="lazy" src={location} alt="location" />
                  <p class="text-gr text-xs font-[thin-font] break-word font-bold">
                    {props.user().place_name_ka.substr(0, 20)}.
                  </p>
                </div>
                <Show when={props.user().status === 200}>
                  <button onClick={() => startTransition(() => props.setModal("ლოკაცია"))}>
                    <img
                      loading="lazy"
                      id="locationButton"
                      src={pen}
                      alt="edit"
                    />
                  </button>
                </Show>
              </Match>
              <Match when={props.user().privacy.location === "დამალვა" && props.user().place_name_ka}>
                <img loading="lazy" src={location} alt="location" />
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  ლოკაცია დამალულია
                </p>
              </Match>
              <Match when={props.user().status === 200}>
                <A
                  href="/setup/xelosani/step/location"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე ლოკაცია
                </A>
              </Match>
              <Match when={props.user().status === 401 && !props.user().place_name_ka}>
                <img loading="lazy" src={location} alt="location" />
                <p class="text-gr text-xs font-[thin-font] font-bold">
                  არ არის დამატებული
                </p>
              </Match>
            </Switch>
          </div>
          <div class="flex pb-1 px-2 items-center gap-x-1">
            <Switch>
              <Match when={props.user().phone && props.user().privacy.phone !== "დამალვა"}>
                <img loading="lazy" src={telephone} alt="telephone" />
                <p class="text-gr text-xs ml-1 font-[thin-font] font-bold">
                  {props.user().phone}
                </p>
              </Match>
              <Match when={props.user().privacy.phone === "დამალვა"}>
                <img loading="lazy" src={telephone} alt="telephone" />
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  ტელ. ნომერი დამალულია
                </p>
              </Match>
              <Match when={props.user().status === 200 && !props.user().phone}>
                <A
                  href="/setup/xelosani/step/contact"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე ტელ. ნომერი
                </A>
              </Match>
              <Match when={props.user().status === 401 && props.user().privacy.phone !== "დამალვა"}>
                <img loading="lazy" src={telephone} alt="telephone" />
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  ტელ. ნომერი არ არის დამატებული
                </p>
              </Match>
            </Switch>
          </div>
          <div class="flex px-2 pb-1 items-center gap-x-1">
            <Switch>
              <Match when={props.user().email && props.user().privacy.email !== "დამალვა"}>
                <img loading="lazy" src={envelope} alt="email" />
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  {props.user().email}
                </p>
              </Match>
              <Match when={props.user().privacy.email === "დამალვა"}>
                <img loading="lazy" src={envelope} alt="email" />
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  მეილი დამალულია
                </p>
              </Match>
              <Match when={props.user().status === 200 && !props.user().email}>
                <A
                  href="/setup/xelosani/step/contact"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე მეილი
                </A>
              </Match>
              <Match when={props.user().status === 401 && props.user().privacy.email !== "დამალვა"}>
                <img loading="lazy" src={envelope} alt="email" />
                <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
                  მეილი არ არის დამატებული
                </p>
              </Match>
            </Switch>
          </div>
          <div class="flex pb-1 px-2 items-center gap-x-1">
            <Switch>
              <Match when={props.user().date && props.user().privacy.birthDate !== "დამალვა"}>
                <div class="flex justify-between w-full items-center">
                  <div class="flex items-end pr-1 gap-x-2">
                    <img loading="lazy" src={cake} alt="cake" />
                    <p class="text-gr text-xs font-[thin-font] font-bold">
                      {props.user().displayBirthDate}
                    </p>
                  </div>
                  <Show when={props.user().status === 200}>
                    <button onClick={() => startTransition(() => props.setModal("ასაკი"))}>
                      <img loading="lazy" src={pen} alt="edit" id="age" width={14} />
                    </button>
                  </Show>
                </div>
              </Match>
              <Match when={props.user().status === 200 && !props.user().date && props.user().privacy.birthDate !== "დამალვა"}>
                <A
                  href="/setup/xelosani/step/age"
                  class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                >
                  დაამატე დაბ. თარიღი
                </A>
              </Match>
              <Match when={props.user().status === 401 && props.user().privacy.birthDate !== "დამალვა"}>
                <div class="flex items-center gap-x-2">
                  <img loading="lazy" src={cake} alt="cake" />
                  <p class="text-gr text-xs font-[thin-font] font-bold">
                    {props.user().displayBirthDate}
                  </p>
                </div>
                <p class="text-gr text-xs text-center font-[thin-font] font-bold">
                  ასაკი არ არის დამატებული
                </p>
              </Match>
              <Match when={props.user().privacy.birthDate === "დამალვა"}>
                <div class="flex gap-x-2 items-center">
                  <img loading="lazy" src={cake} alt="cake" />
                  <p class="text-gr text-xs text-center font-[thin-font] font-bold">
                    ასაკი დამალულია
                  </p>
                </div>
              </Match>
            </Switch>
          </div>
          <Show when={props.user().status === 401 && props.user().viewer_prof_id && props.user().viewer_prof_id !== props.url_prof_id}>
            <div class="flex flex-col gap-y-1 pb-1 px-2 items-center">
              <button
                onClick={() => startConversation(props.url_prof_id, props.user().role)}
                class="bg-dark-green w-full py-1 px-2 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
              >
                მიწერა
              </button>
              <Show when={friend()?.length > 1} fallback={<button
                onClick={friend()[0].executable}
                class="bg-dark-green w-full py-1 px-2 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
              >
                {friend()[0].content}
              </button>
              }>
                <For each={friend()}>
                  {(f) => (
                    <button
                      onClick={f.executable}
                      class="bg-dark-green w-full py-1 px-2 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                    >
                      {f.content}
                    </button>
                  )}
                </For>
              </Show>
            </div>
          </Show>
        </div>
      </div>

      {/* Schedule Section */}
      <div class="px-4 py-4 bg-white shadow-md rounded-lg">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-[bolder-font]">სამუშაო განრიგი</h2>
          <Show when={props.user().status === 200 && props.user().schedule}>
            <button onClick={() => startTransition(() => props.setModal("განრიგი"))}>
              <img loading="lazy" src={pen} alt="edit" id="schedule" />
            </button>
          </Show>
        </div>
        <Switch>
          <Match when={props.user().schedule}>
            <ul class="mt-2 space-y-2">
              <For each={props.user().schedule}>
                {(s, i) => (
                  <li class="flex items-center justify-between text-sm font-[thin-font] font-bold gap-x-2">
                    <p>{s.day}</p>
                    <div class="flex items-center gap-x-1">
                      <p>{s.startTime}</p>
                      <span>-</span>
                      <p>{s.endTime}</p>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </Match>
          <Match when={props.user().status === 401}>
            <p class="text-xs font-[thin-font] font-bold text-gr pt-2">
              განრიგი ცარიელია
            </p>
          </Match>
          <Match when={props.user().status === 200}>
            <div class="flex items-center justify-center pt-2">
              <A
                href="/setup/xelosani/step/schedule"
                class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
              >
                დაამატე განრიგი
              </A>
            </div>
          </Match>
        </Switch>
      </div>

      {/* Rating Section */}
      <div class="px-4 py-4 bg-white shadow-md rounded-lg">
        <h2 class="text-lg font-[bolder-font]">საშუალო შეფასება</h2>
        <Switch>
          <Match when={false}>
            {props.user().avgrating && (
              <div class="flex space-x-1">
                <Index each={new Array(3)}>
                  {() => (
                    <img loading="lazy" src={fullStar} alt="full star" />
                  )}
                </Index>
                <Index each={new Array(5 - 3)}>
                  {() => (
                    <img loading="lazy" src={emptyStar} alt="empty star" />
                  )}
                </Index>
              </div>
            )}
          </Match>
          <Match when={true}>
            <p class="text-xs text-gr mt-2 font-[thin-font] font-bold">
              მომხმარებელი არ არის შეფასებული.
            </p>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
