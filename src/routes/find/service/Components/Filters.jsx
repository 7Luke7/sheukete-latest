import { Match, Switch } from "solid-js";
import { PricingRange } from "./PriceRange";
import { LocationFilter } from "./LocationFilter";
import { Distance } from "./Distance";
import { A } from "@solidjs/router";

export const ServiceFilters = (props) => {
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
          <A 
            href={`http://localhost:3000/find/service?category=${props.main}`}
          >
            {props.main}
          </A>
          {props.category !==
            props.main && (
            <>
              <span>/</span>
              <A href={`http://localhost:3000/find/service?category=${props.parent}`}>
                {props.parent}
              </A>
            </>
          )}
        </div>
        <div class="flex flex-col gap-y-1">
          <Switch>
            <Match
              when={
                props.main === props.category
              }
            >
              <For each={props.displayCategories.parent}>
                {(l) => {
                  return (
                    <A
                    href={`http://localhost:3000/find/service?category=${l}`}
                    class="text-xs text-left font-semibold font-[thin-font]"
                    >
                      {l}
                    </A>
                  );
                }}
              </For>
            </Match>
            <Match
              when={props.parent && props.category}
            >
              <For
                each={props.displayCategories.child}
              >
                {(l) => {
                  return (
                    <A
                      href={`http://localhost:3000/find/service?category=${l}`}
                      class="text-xs text-left font-bold font-[thin-font]"
                    >
                      {l}
                    </A>
                  );
                }}
              </For>
            </Match>
          </Switch>
        </div>
        <PricingRange
          priceFrom={props.priceFrom}
          priceTo={props.priceTo}
          min_price_filter={props.min_price_filter}
          max_price_filter={props.max_price_filter}
        ></PricingRange>
        <LocationFilter
            city={props.city}
            region={props.region}
            currentSearchURL={props.currentSearchURL}
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
