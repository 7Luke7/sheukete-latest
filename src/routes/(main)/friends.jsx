import { Header } from "~/Components/Header";
import Sidebar from "./friend_contents/sidebar";

const Friends = (props) => {
  return (
    <>
      <Header></Header>
      <section id="notificationsArea" class="flex overflow-y-auto h-[calc(100vh-46px)] bg-gray-50">
        <div class="border-r border-gray-200 left-0 sticky top-0 px-4 py-6 w-[600px]">
          {new Sidebar().render(props.location.pathname)}
        </div>
        <div class="w-full px-6 py-6 ">{props.children}</div>
      </section>
    </>
  );
};

export default Friends;