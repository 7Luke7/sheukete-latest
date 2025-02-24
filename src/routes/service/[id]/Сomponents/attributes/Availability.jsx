import { For, Show } from "solid-js"

export const Availability = (props) => {
    return <>
    <h2 class="text-lg font-semibold mb-2">ხელმისაწვდომობა</h2>
    <Show
      when={
        props.availability && props.availability.length > 0
      }
      fallback={
        <p class="text-gray-600">No availability info provided.</p>
      }
    >
      <ul class="mt-2 space-y-1">
        <For each={props.availability}>
          {(slot) => (
            <li class="text-sm text-gray-600">
              {slot.day}: {slot.startTime} - {slot.endTime}
            </li>
          )}
        </For>
      </ul>
    </Show>
  </>
}