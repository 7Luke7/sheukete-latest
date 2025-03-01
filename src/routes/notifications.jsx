import { A, useLocation } from "@solidjs/router";
import { Header } from "~/Components/Header";
import threeDotsSVG from "../svg-images/three-dots.svg";
import dropdownSVG from "../svg-images/svgexport-8.svg";
import { createSignal, Show } from "solid-js";

const Notifications = (props) => {
    const [spn, setSpn] = createSignal(props.location.pathname === '/notifications/unread' || props.location.pathname === '/notifications')
    const [un, setUn] = createSignal(props.location.pathname === '/notifications/users/unread' || props.location.pathname === '/notifications/users/all')

  return (
    <>
      <Header></Header>
      <section id="notificationsArea" class="flex overflow-y-auto h-[calc(100vh-46px)] bg-gray-50">
        <div class="border-r border-gray-200 left-0 sticky top-0 px-4 py-6 w-[600px]">
          <h1 class="text-2xl font-semibold text-gray-800 mb-6">
            შეტყობინებები
          </h1>
          <div class="flex flex-col gap-y-3">
            <div class="bg-white rounded-lg shadow">
              <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <span class="text-lg font-medium text-gray-700">
                  სიახლეები & შეთავაზებები
                </span>
                <div class="flex gap-x-2 items-center">
                  <button>
                    <img width={20} src={threeDotsSVG} alt="More options"></img>
                  </button>
                  <button onClick={(e) => {
                    e.preventDefault()
                    setSpn((prev) => !prev)
                  }}>
                    <img width={20} src={dropdownSVG} alt="Toggle dropdown" class={`${spn() ? '' : 'rotate-180'} transition-transform duration-200`}></img>
                  </button>
                </div>
              </div>
              <Show when={spn()}>
                <div class="flex flex-col py-2 px-6 gap-y-2">
                    <A
                    href="/notifications"
                    class={`block py-2 px-4 rounded-md hover:bg-gray-100 transition-colors ${props.location.pathname === '/notifications' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
                    >
                    ყველა
                    </A>
                    <A
                    href="unread"
                    class={`block py-2 px-4 rounded-md hover:bg-gray-100 transition-colors ${props.location.pathname === '/notifications/unread' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
                    >
                    წაუკითხავი
                    </A>
                </div>
              </Show>
            </div>
            <div class="bg-white rounded-lg shadow">
              <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <span class="text-lg font-medium text-gray-700">
                  მომხმარებლები
                </span>
                <div class="flex gap-x-2 items-center">
                  <button>
                    <img width={20} src={threeDotsSVG} alt="More options"></img>
                  </button>
                  <button onClick={(e) => {
                    e.preventDefault()
                    setUn((prev) => !prev)
                  }}>
                    <img width={20} src={dropdownSVG} alt="Toggle dropdown" class={`${un() ? '' : 'rotate-180'} transition-transform duration-200`}></img>
                  </button>
                </div>
              </div>
              <Show when={un()}>
                <div class="flex flex-col py-2 px-6 gap-y-2">
                    <A
                    href="users/all"
                    class={`block py-2 px-4 rounded-md hover:bg-gray-100 transition-colors ${props.location.pathname === '/notifications/users/all' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
                    >
                    ყველა
                    </A>
                    <A
                    href="users/unread"
                    class={`block py-2 px-4 rounded-md hover:bg-gray-100 transition-colors ${props.location.pathname === '/notifications/users/unread' ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
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