import { createAsync } from "@solidjs/router";
import { Header } from "~/Components/Header";
import { SignleServiceRenderer } from "~/routes/find/service/Components/SingleServiceRenderer";

const AllServices = (props) => {
  // if I truly want to have SSR then I might have to do pagination without endless scrolling
  const all_user_services = createAsync(
    async () =>
      (
        await fetch(
          `http://localhost:3000/api/xelosani/service/all_services?prid=${
            props?.location?.pathname?.split("/")[2]
          }&cursor=50`
        )
      ).json(),
    { deferStream: true }
  );

  return (
    <>
      <Header></Header>
      <div class="w-[90%] flex flex-col mx-auto mt-10">
        <h1 class="font-[bolder-font] text-lg">ლუკა ჩიკვაიძე - სერვისები</h1>
        <div class="grid grid-cols-1">
          <For each={all_user_services()}>
            {(s, i) => {
              return <SignleServiceRenderer s={s} i={i}></SignleServiceRenderer>;
            }}
          </For>
        </div>
      </div>
    </>
  );
};

export default AllServices;
