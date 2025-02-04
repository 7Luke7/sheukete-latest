import { For } from "solid-js";
import { SignleServiceRenderer } from "./SingleServiceRenderer";

export const ServicesRenderer = (props) => {
  return (
    <div class="grid grid-cols-1 gap-2">
      <For each={props.services}>
        {(s, i) => {
          return (
            <SignleServiceRenderer
              serviceOnMapContent={props.serviceOnMapContent}
              setServiceOnMapContent={props.setServiceOnMapContent}
              s={s}
              i={i}
            ></SignleServiceRenderer>
          );
        }}
      </For>
    </div>
  );
};
