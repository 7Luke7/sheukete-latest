import { Match, Switch } from "solid-js";
import jobs from "../../../../Components/header-comps/jobs_list.json";
import { PricingRange } from "./PriceRange";
import { LocationFilter } from "./LocationFilter";
import { Distance } from "./Distance";

export const ServiceFilters = (props) => {
    const changeParams = (target) => {
        const sp = new URLSearchParams(props.currentSearchURL)
        sp.set("category", target)
        return window.location.search = sp.toString()
    }

    const handleFiltering = (e) => {
      e.preventDefault()
      const fd = new FormData(e.target)
      const sp = new URLSearchParams(props.currentSearchURL)
      fd.forEach((v, k) => {
        sp.set(k, v)
      })
      return window.location.search = sp.toString()
    }

    return (
    <form onSubmit={handleFiltering} class="w-1/6 h-full left-0 top-[46px] sticky py-2 border-r">
      <div class="w-full flex justify-between px-4 h-[calc(100vh-80px)] flex-col pt-3">
        <div class="flex gap-y-3 flex-col ">
        <div class="flex font-[thin-font] gap-x-1 border-b pb-2 font-bold text-xs">
          <button type="button" onClick={() => changeParams(props.services().main)}>
            {props.services().main}
          </button>
          {props.services().defaultParams.category !==
            props.services().main && (
            <>
              <span>/</span>
              <button type="button" onClick={() => changeParams(props.services().parent)}>
                {props.services().parent}
              </button>
            </>
          )}
        </div>
        <div class="flex flex-col gap-y-1">
          <Switch>
            <Match
              when={
                props.services().services[0].categories[
                  props.services().services[0].categories.length - 2
                ] === props.services().defaultParams.category
              }
            >
              <For
                each={jobs[0][
                  props.services().services[0].categories[
                    props.services().services[0].categories.length - 2
                  ]
                ].map((a) => a["კატეგორია"])}
              >
                {(c) => {
                  return (
                    <button
                    type="button"
                    onClick={() => changeParams(c)}
                      class="text-left text-xs font-bold font-[thin-font]"
                    >
                      {c}
                    </button>
                  );
                }}
              </For>
            </Match>
            <Match
              when={
                props.services().services[0].categories[
                  props.services().services[0].categories.length - 1
                ] && props.services().defaultParams.category
              }
            >
              <For
                each={
                  jobs[0][
                    props.services().services[0].categories[
                      props.services().services[0].categories.length - 2
                    ]
                  ].find(
                    (pc) =>
                      pc["კატეგორია"] ===
                      props.services().services[0].categories[
                        props.services().services[0].categories.length - 1
                      ]
                  )["სამუშაოები"]
                }
              >
                {(c) => {
                  return (
                    <button
                      type="button"
                      onClick={() => changeParams(c)}
                      class="text-xs text-left font-bold font-[thin-font]"
                    >
                      {c}
                    </button>
                  );
                }}
              </For>
            </Match>
          </Switch>
        </div>
        <PricingRange
          currentSearchParams={props.services().defaultParams}
          currentSearchURL={props.services().query}
        ></PricingRange>
        <LocationFilter
            currentSearchParams={props.services().defaultParams}
            currentSearchURL={props.services().query}
        ></LocationFilter>
        <Distance></Distance>
        </div>
        <button type="submit" class="text-sm rounded px-2 py-1 text-white font-[thin-font] font-bold bg-dark-green">
          გაფილტვრა
      </button>
      </div>
    </form>
  );
};
