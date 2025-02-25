import { createAsync } from "@solidjs/router";
import { Header } from "~/Components/Header";
import { SignleServiceRenderer } from "~/routes/find/service/Components/SingleServiceRenderer";

const AllServices = (props) => {
  const all_user_services = createAsync(
    async () =>
      (
        await fetch(
          `http://localhost:3000/api/xelosani/service/all_services?prid=${
            props?.location?.pathname?.split("/")[2]
          }${props?.location?.search?.split("=")[1] ? props.location.search.split("=")[1] : ""}`
        )
      ).json(),
    { deferStream: true }
  );
  return (
    <>
      <Header></Header>
      <div class="w-[90%] flex flex-col mx-auto mt-10">
        <h1 class="font-[bolder-font] text-lg">ლუკა ჩიკვაიძე - სერვისები</h1>
        <div class="grid grid-cols-6 gap-2">
          <For each={all_user_services()}>
            {(s, i) => {
              return (
                <SignleServiceRenderer s={s} i={i}></SignleServiceRenderer>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
};

export default AllServices;
