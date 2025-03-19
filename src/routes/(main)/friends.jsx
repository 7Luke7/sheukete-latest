import { Header } from "~/Components/Header";
import { Match, Switch } from "solid-js";
import { MainFriends } from "./friend_contents/main";
import Others from "./friend_contents/others";
import { useLocation } from "@solidjs/router";

const Friends = (props) => {
  const location = useLocation()
  return (
    <>
      <Header></Header>
      <section id="notificationsArea" class="flex overflow-y-auto h-[calc(100vh-46px)] bg-gray-50">
        <div class="border-r border-gray-200 left-0 sticky top-0 px-4 py-6 w-[600px]">
          <Switch fallback={new Others(location.pathname.startsWith("/friends") ? location.pathname : location?.state?.fromFriends).render()}>
            <Match when={location.pathname === "/friends"}>
              <MainFriends></MainFriends>
            </Match>
          </Switch>
        </div>
        <div class="w-full px-6 py-6">{props.children}</div>
      </section>
    </>
  );
};

export default Friends;