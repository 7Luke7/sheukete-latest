import { For, Show } from "solid-js"

export const Schedule = (props) => {
    return <>
    <h2 class="text-lg font-semibold mb-2">ხელმისაწვდომობა</h2>
    <Show
      when={
        props.schedule && props.schedule.length > 0
      }
      fallback={
        <p class="text-gray-600">No schedule info provided.</p>
      }
    >
      <ul class="mt-2 space-y-1">
        <For each={props.schedule}>
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