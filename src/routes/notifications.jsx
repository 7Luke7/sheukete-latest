import { A } from "@solidjs/router";
import threeDotsSVG from "../svg-images/three-dots.svg";
import dropdownSVG from "../svg-images/svgexport-8.svg";
import { createSignal, Show } from "solid-js";
import { Header } from "~/Components/Header";
import { mark_all_specials_as_read, mark_all_users_as_read } from "./notifications/utils";
import checkGray from "../svg-images/check-gray.svg";
import extLink from "../svg-images/external_link.svg";

const Notifications = (props) => {
  const [spn, setSpn] = createSignal(
    props.location.pathname === "/notifications/specials/unread" ||
      props.location.pathname === "/notifications/specials"
  );
  const [un, setUn] = createSignal(
    props.location.pathname === "/notifications/users/unread" ||
      props.location.pathname === "/notifications/users/all"
  );
  const [showOptions, setShowOptions] = createSignal();

  return (
    <>
      <Header></Header>
      <section
        id="notificationsArea"
        class="flex relative overflow-y-auto h-[calc(100vh-46px)] bg-gray-50"
      >
        <Show when={showOptions() && showOptions() === "specials"}>
                    <div
                      class="absolute ml-[600px] mt-2 z-[50] flex flex-col gap-y-2 items-start px-2 py-4 bg-white rounded shadow-xl border border-slate-100"
                    >
                      <div
                        class="absolute -top-2 right-4 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-slate-100"
                      ></div>
                      <button
                        onClick={mark_all_specials_as_read}
                        class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full"
                      >
                        <div class="w-[24px] h-[24px]">
                          <img src={checkGray} alt="" />
                        </div>
                        მონიშნეთ ყველა წაკითხულად
                      </button>
                      <A
                        href="/settings/notifications"
                        class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full"
                      >
                        <div
                          class="w-[24px] flex items-center justify-center h-[24px]"
                        >
                          <img src={extLink} alt="" />
                        </div>
                        შეტყობინებების პარამეტრები
                      </A>
                    </div>
                  </Show>
                  <Show when={showOptions() && showOptions() === "users"}>
                    <div
                      class="absolute top-full mt-2 -right-2 z-[50] flex flex-col gap-y-2 items-start w-2/3 px-2 py-4 bg-white rounded shadow-xl border border-gray-200"
                    >
                      <div
                        class="absolute -top-2 right-4 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white"
                      ></div>
                      <button
                        onClick={mark_all_users_as_read}
                        class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full"
                      >
                        <div class="w-[24px] h-[24px]">
                          <img src={checkGray} alt="" />
                        </div>
                        მონიშნეთ ყველა წაკითხულად
                      </button>
                      <A
                        href="/settings/notifications"
                        class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full"
                      >
                        <div
                          class="w-[24px] flex items-center justify-center h-[24px]"
                        >
                          <img src={extLink} alt="" />
                        </div>
                        შეტყობინებების პარამეტრები
                      </A>
                    </div>
                  </Show>
        <div class="border-r border-gray-200 left-0 sticky top-0 px-4 py-6 w-[600px]">
          <h1 class="text-2xl font-semibold text-gray-800 mb-6">
            შეტყობინებები
          </h1>
          <div class="flex flex-col gap-y-3">
          <A href="/notifications">
                    <div class={`block py-2 px-4 rounded-md shadow hover:bg-gray-100 transition-colors ${
                      props.location.pathname === "/notifications"
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "text-gray-700 bg-white"
                    }`}
                  >
                    <span class="font-[normal-font]">მთავარი</span>
                    </div>
          </A>
            <div class="bg-white rounded-lg shadow">
              <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <span class="text-lg font-[normal-font] text-gray-700">
                  სიახლეები & შეთავაზებები
                </span>
                <div class="flex gap-x-2 items-center">
                  <button onClick={() => setShowOptions("specials")}>
                    <img width={20} src={threeDotsSVG} alt="More options"></img>
                  </button>
                  <button onClick={() => setSpn((prev) => !prev)}>
                    <img
                      width={20}
                      src={dropdownSVG}
                      alt="Toggle dropdown"
                      class={`${
                        spn() ? "" : "rotate-180"
                      } transition-transform duration-200`}
                    ></img>
                  </button>
                </div>
              </div>
              <Show when={spn()}>
                <div class="flex flex-col py-2 px-6 gap-y-2">
                  <A
                    href="/notifications/specials"
                    class={`block py-2 px-4 rounded-md hover:bg-gray-100 transition-colors ${
                      props.location.pathname === "/notifications/specials"
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    ყველა
                  </A>
                  <A
                    href="specials/unread"
                    class={`block py-2 px-4 rounded-md hover:bg-gray-100 transition-colors ${
                      props.location.pathname === "/notifications/specials/unread"
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    წაუკითხავი
                  </A>
                </div>
              </Show>
            </div>
            <div class="bg-white rounded-lg shadow">
              <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <span class="text-lg font-[normal-font] text-gray-700">
                  მომხმარებლები
                </span>
                <div class="flex gap-x-2 items-center">
                  <button onClick={() => setShowOptions("users")}>
                    <img width={20} src={threeDotsSVG} alt="More options"></img>
                  </button>
                  <button onClick={() => setUn((prev) => !prev)}>
                    <img
                      width={20}
                      src={dropdownSVG}
                      alt="Toggle dropdown"
                      class={`${
                        un() ? "" : "rotate-180"
                      } transition-transform duration-200`}
                    ></img>
                  </button>
                </div>
              </div>
              <Show when={un()}>
                <div class="flex flex-col py-2 px-6 gap-y-2">
                  <A
                    href="users/all"
                    class={`block py-2 px-4 rounded-md hover:bg-gray-100 transition-colors ${
                      props.location.pathname === "/notifications/users/all"
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    ყველა
                  </A>
                  <A
                    href="users/unread"
                    class={`block py-2 px-4 rounded-md hover:bg-gray-100 transition-colors ${
                      props.location.pathname === "/notifications/users/unread"
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    წაუკითხავი
                  </A>
                </div>
              </Show>
            </div>
          </div>
        </div>
        <div class="w-full px-6 py-6">{props.children}</div>
      </section>
    </>
  );
};

export default Notifications;
