import { For, Show } from "solid-js";

export const ServicesModal = (props) => {
  return (
    <div
      id="serviceWrapper"
      class="py-6 min-h-[460px] relative mb-5"
    >
      <h2 class="text-lg font-bold text-center text-gray-800">
        ქვე-სერვისები
      </h2>
      <div class="grid gap-4 mt-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        <For each={props.service()}>
          {(m, index) => (
            <div class="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h2 class="mb-2 text-sm font-semibold text-gray-700">
                {m.category}
              </h2>
              <input
                class="w-full bg-gray-50 border border-gray-300 rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                spellcheck="false"
                placeholder="სერვისის სათაური"
                id="title"
                onInput={(e) =>
                  props.setService((cm) => {
                    cm[index()].title = e.target.value;
                    return cm;
                  })
                }
                value={m.title}
                maxLength={60}
                name="title"
                type="text"
              />
              <Show
                when={props.error()?.some(
                  (a) => a.field === `service.${index()}.title`
                )}
              >
                <p class="text-xs text-red-500 font-semibold mb-2">
                  {
                    props.error().find(
                      (a) => a.field === `service.${index()}.title`
                    ).message
                  }
                </p>
              </Show>
              <textarea
                class="w-full bg-gray-50 border border-gray-300 rounded p-3 h-40 mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                spellcheck="false"
                name="description"
                value={m.description}
                onInput={(e) =>
                  props.setService((cm) => {
                    cm[index()].description = e.target.value;
                    return cm;
                  })
                }
                maxlength={300}
                id="desc"
                placeholder="აღწერეთ სერვისის დეტალები"
              ></textarea>
              <Show
                when={props.error()?.some(
                  (a) => a.field === `service.${index()}.description`
                )}
              >
                <p class="text-xs text-red-500 font-semibold mb-2">
                  {
                    props.error().find(
                      (a) => a.field === `service.${index()}.description`
                    ).message
                  }
                </p>
              </Show>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <input
                    class="w-24 bg-gray-50 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="ფასი"
                    min={1}
                    onInput={(e) =>
                      props.setService((cm) => {
                        cm[index()].price = Number(e.target.value);
                        return cm;
                      })
                    }
                    id="price"
                    value={m.price}
                    name="price"
                    type="number"
                  />
                  <span class="text-2xl font-bold font-[normal-font] text-gray-700">₾</span>
                </div>
                <Show
                  when={props.error()?.some(
                    (a) => a.field === `service.${index()}.price`
                  )}
                >
                  <p class="text-xs text-red-500 font-semibold">
                    {
                      props.error().find(
                        (a) => a.field === `service.${index()}.price`
                      ).message
                    }
                  </p>
                </Show>
              </div>
              <button
                onClick={() => props.removeService(index())}
                type="button"
                class="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition"
              >
                სერვისის წაშლა
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
