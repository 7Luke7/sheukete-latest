import { createSignal, Show, Switch, Match } from "solid-js";
import { createAsync, A, useNavigate } from "@solidjs/router";
import {
  handle_location,
  check_location,
} from "../../../api/xelosani/setup/setup";
import { MapRenderer } from "~/routes/map/MapRenderer";
import { Link, MetaProvider, Title } from "@solidjs/meta";

const Location = () => {
  const location = createAsync(check_location);
  const [submitted, setSubmitted] = createSignal(false);
  const [markedLocation, setMarkedLocation] = createSignal();

  const navigate = useNavigate();

  const handleLocationSubmit = async () => {
    try {
      const response = await handle_location(markedLocation());
      if (response.status !== 200) throw new Error(response);
      if (response.stepPercent === 100) {
        return navigate(`/xelosani/${response.profId}`); // ჩანიშვნა
      }
      setSubmitted(true);
    } catch (error) {
      console.log(error.message);
      if (error.message === "401") {
        return alert("მომხმარებელი არ არის შესული სისტემაში.");
      }
      return alert("წარმოიშვა შეცდომა ცადეთ მოგვიანებით.");
    }
  };

  return (
    <MetaProvider>
    <Link href="https://cdn.maptiler.com/maptiler-sdk-js/v3.0.1/maptiler-sdk.css" rel="stylesheet"></Link>
    <script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.0.1/maptiler-sdk.umd.min.js"></script>
    <Title>სეტაპი | ლოკაცია</Title>
    <Show when={location()}>
      <div class="h-[500px] w-full">
        <Switch>
          <Match when={location() === 400 && !submitted()}>
            <div class="flex h-full flex-col items-start justify-start">
              <MapRenderer
                setMarkedLocation={setMarkedLocation}
                width={"100%"}
                height={"100%"}
              ></MapRenderer>
              <div class="px-2 w-full flex flex-col gap-y-2 my-2">
                <div class="flex items-center gap-x-1">
                    <p class="text-gray-800 font-[thin-font] font-bold">შერჩეული:</p>
                    <p class="text-[12px] text-gray-800 font-[thin-font] break-word font-bold">{markedLocation()?.placeNameKa   }</p>
                </div>
                <button
                  onClick={handleLocationSubmit}
                  className="py-2 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover"
                >
                  გაგრძელება
                </button>
              </div>
            </div>
          </Match>
          <Match when={location() !== 400 || submitted()}>
            <div class="flex w-full flex-col justify-center h-full items-center">
              <p class="text-sm font-[normal-font] font-bold text-gray-700">
                ლოკაცია დამატებული გაქვთ გთხოვთ განაგრძოთ.
              </p>
              <A
                className="py-2 mt-3 w-1/2 text-center rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover"
                href="/setup/xelosani/step/about"
              >
                გაგრძელება
              </A>
            </div>
          </Match>
        </Switch>
      </div>
    </Show>
    </MetaProvider>
  );
};

export default Location;
