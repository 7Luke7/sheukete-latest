import { For, Show } from "solid-js"

export const ExtraServices = (props) => {
    return <>
    <h2 class="text-lg font-semibold mb-2">დამატებითი სერვისები</h2>
    <Show
      when={
        props.child_services && props.child_services.length > 0
      }
      fallback={<p class="text-gray-600">No additional services.</p>}
    >
      <div class="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={props.child_services}>
          {(child) => (
            <div class="p-4 bg-gray-50 rounded shadow hover:shadow-md transition">
              <h3 class="text-md font-bold">{child.title}</h3>
              <p class="mt-1 text-xs text-gray-600">
                {child.description}
              </p>
              <p class="mt-1 text-gray-800 font-bold">
                Price: ₾{child.price}
              </p>
              <button class="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-xs">
                შეუკვეთე
              </button>
            </div>
          )}
        </For>
      </div>
    </Show>
  </>
}