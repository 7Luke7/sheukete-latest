import { A, createAsync } from "@solidjs/router";
import { Header } from "~/Components/Header";
import { get_all_friends } from "../api/friends/friends";

const Friends = () => {
  const friends = createAsync(() => get_all_friends());
  return (
    <>
      <Header></Header>
      <section class="w-full h-screen flex">
        <section class="border-r px-2 w-[450px]">
          <div class="flex gap-y-4 mt-4 flex-col">
            <A
              href="#"
              class="flex px-2 py-2 rounded-lg focus:bg-gray-200 hover:bg-gray-100 justify-between"
            >
              <div class="flex">
              <h1>
                    მეგობრები
                </h1>
              </div>
            </A>
          </div>
        </section>
        <div class="w-full">full width</div>
      </section>
    </>
  );
};

export default Friends;
