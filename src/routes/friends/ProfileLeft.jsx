import { Index, Match, createSignal, onMount, Show, Switch, batch, startTransition } from "solid-js";
import location from "../../svg-images/location.svg";
import telephone from "../../svg-images/telephone.svg";
import envelope from "../../svg-images/envelope.svg";
import CameraSVG from "../../svg-images/camera.svg";
import pen from "../../svg-images/pen.svg";
import cake from "../../svg-images/cake.svg";
import spinnerSVG from "../../svg-images/spinner.svg";
import { A } from "@solidjs/router";
import { makeAbortable } from "@solid-primitives/resource";
import {Buffer} from "buffer"
 
export const ProfileLeft = (props) => {
  const [imageLoading, setImageLoading] = createSignal(false);
  const [imageUrl, setImageUrl] = createSignal();
  const [file, setFile] = createSignal();
  const [signal,abort,filterErrors] = makeAbortable({timeout: 0, noAutoAbort: true});
  const [friendRequestId, setFriendRequestId] = createSignal()
  const [sendingFriendRequest, setSendingFriendRequest] = createSignal()

  onMount(async () => {
    if (props.user().status === 200) {
      return
    }
    try {
      const response = await fetch(`http://localhost:4321/friend/request/${props.user().profId}/status`, {
        method: "GET",
        credentials: "include"
      })

      if (response.status === 200) {
        const data = await response.json()
        
        if (data.status === "accepted" || data.status === "pending") {
          setFriendRequestId({
            status: data.status,
            id: data.id
          })          
        }
      } else {
        throw new Error("დაფიქსირდა შეცდომა მეგობრობის მოთხოვნის გაგზავნისას.")
      }
    } catch (error) {
      console.log(error)
    }
  })

  const handleFilePreview = async (file) => {
    if (file.size > 2 * 1024 * 1024) {
      return batch(() => {
        props.setToast({
          type: false,
          message: "ფაილის ზომა აღემატება 2მბ ლიმიტს."
        })
      })
    }
    setImageLoading(true)
    try {
      const worker = new Worker(
        new URL("../../../Components/readImagesWorker.js", import.meta.url)
      );

      worker.onmessage = async (e) => {
        const buffer = e.data;
        const base64string = Buffer.from(buffer, "utf-8").toString("base64");
        batch(() => {
          setFile(file);
          setImageLoading(false);
          setImageUrl(`data:image/png;base64,${base64string}`);
        });
      };
      worker.postMessage(file);
    } catch (error) {
      console.log(error);
    }
  };

  const sendFriendRequest = async () => {
    setSendingFriendRequest(true)
    try {
        const response = await fetch(`http://localhost:4321/xelosani/friend/send/${props.user().profId}`, {
        method: "GET",
        credentials: "include",
        signal: signal()
      })

      const data = await response.json()

      if (response.status === 200) {        
        batch(() => {
          props.setToast({
            type: true,
            message: data.message
          })
          setFriendRequestId({
            status: "pending",
            id: data.friend_request_id
          })
        })
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
      console.log(error)
    } finally {
      setSendingFriendRequest(false)
    }
  }

  const unfriend_or_cancel_request = async () => {
    try {
      if (!friendRequestId()) {
        throw new Error("მეგობრობის მოთხოვნა არ არის გაგზავნილი.")
      }
      const response = await fetch(`http://localhost:4321/friend/${friendRequestId().status}`, {
        method: "POST",
        body: JSON.stringify({
          friend_request_id: friendRequestId().id,
        }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (response.status === 200) {
        const data = await response.json()
        
        batch(() => {
          setFriendRequestId(null)
        })
      } else {
        throw new Error("დაფიქსირდა შეცდომა მეგობრობის მოთხოვნის გაგზავნისას.")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div class="flex sticky top-[50px] gap-y-3 flex-col">
  {/* Profile Section */}
  <div class="relative flex flex-col min-w-[262px] items-center flex-[2] bg-white shadow-md rounded-lg p-6">
        <div class="relative">
          <img
            loading="lazy"
            id="prof_pic"
            class="h-[180px] w-[180px] rounded-full my-2"
            src={`http://localhost:5555/static/images/xelosani/profile/${props.user()?.profId}.webp`}
            onError={(e) => {
              e.currentTarget.src =
                "http://localhost:5555/static/images/default_profile.png";
            }}
            alt="profilis foto"
          />
          <span class="absolute bottom-2 right-6 w-5 h-5 bg-[#14a800] rounded-full"></span>
        </div>
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
          </Match>
          <Match when={props.user().privacy.location === "დამალვა" && props.user().place_name_ka}>
            <img loading="lazy" src={location} alt="location" />
            <p class="text-gr ml-1 text-xs font-[thin-font] font-bold">
              ლოკაცია დამალულია
            </p>
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
            </div>
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
      <Show when={props.user().status === 401}>
        <div class="flex pb-1 px-2 items-center gap-x-1">
          <button
            onClick={
              sendingFriendRequest()
                ? () => abort()
                : friendRequestId()
                ? unfriend_or_cancel_request
                : sendFriendRequest
            }
            class="bg-dark-green w-full py-1 font-[thin-font] text-sm font-bold hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
          >
            {sendingFriendRequest()
              ? "გაუქმება"
              : friendRequestId()?.status === "pending"
              ? "მოთხოვნის გაუქმება"
              : friendRequestId()?.status === "accepted"
              ? "მეგობრობიდან წაშლა"
              : "მეგობრობის გაგზავნა"}
          </button>
        </div>
      </Show>
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
    </div>
  </div>

  {/* Schedule Section */}
  <div class="px-4 py-4 bg-white shadow-md rounded-lg">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-[bolder-font]">სამუშაო განრიგი</h2>
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
        <div class="flex items-center justify-center pt-2">
          <p class="text-sm font-[thin-font] font-bold text-gr">
            განრიგი ცარიელია
          </p>
        </div>
      </Match>
    </Switch>
  </div>

  {/* Rating Section */}
  <div class="px-4 py-4 bg-white shadow-md rounded-lg">
    <h2 class="text-lg font-[bolder-font]">საშუალო შეფასება</h2>
    <Switch>
      <Match when={false}>
        {/* Optionally include detailed rating bars here */}
      </Match>
      <Match when={true}>
        <p class="text-xs text-gr mt-2 text-center font-[thin-font] font-bold">
          მომხმარებელი არ არის შეფასებული.
        </p>
      </Match>
    </Switch>
  </div>
</div>


  );
};
