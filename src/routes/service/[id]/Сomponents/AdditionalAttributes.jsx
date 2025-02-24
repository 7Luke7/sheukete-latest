import { createSignal, Match, Switch } from "solid-js";
import { Availability } from "./attributes/Availability";
import { ExtraServices } from "./attributes/ExtraServices";
import { ServiceReviews } from "./attributes/ServiceReviews";

const TAB = {
  EXTRAS: 0,
  AVAILABILITY: 1,
  REVIEWS: 2,
};
export const AdditionalAttributes = (props) => {
  const [activeTab, setActiveTab] = createSignal(TAB.EXTRAS);

  return (
    <div class="mt-10 min-h-[200px]">
      <div class="flex gap-4 border-b pb-1 mb-4">
        <button
          class={`pb-2 ${
            activeTab() === TAB.EXTRAS
              ? "border-b-2 border-green-600 text-green-700"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab(TAB.EXTRAS)}
        >
          დამატებითი სერვისები
        </button>
        <button
          class={`pb-2 ${
            activeTab() === TAB.AVAILABILITY
              ? "border-b-2 border-green-600 text-green-700"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab(TAB.AVAILABILITY)}
        >
          ხელმისაწვდომობა
        </button>
        <button
          class={`pb-2 ${
            activeTab() === TAB.REVIEWS
              ? "border-b-2 border-green-600 text-green-700"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab(TAB.REVIEWS)}
        >
          შეფასებები
        </button>
      </div>

      <Switch>
        <Match when={activeTab() === TAB.EXTRAS}>
          <ExtraServices child_services={props.child_services}></ExtraServices>
        </Match>
        <Match when={activeTab() === TAB.AVAILABILITY}>
          <Availability availability={props.availability}></Availability>
        </Match>
        <Match when={activeTab() === TAB.REVIEWS}>
          <ServiceReviews></ServiceReviews>
        </Match>
      </Switch>
    </div>
  );
};
