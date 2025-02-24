import { A } from "@solidjs/router";
import { For, Index, Match, onMount, Switch, Show } from "solid-js";
import EditSVG from "../../../svg-images/edit_icon.svg";
import emptyStar from "../../../svg-images/svgexport-24.svg";
import fullStar from "../../../svg-images/svgexport-19.svg";
import avialabilityIcon from "../../../svg-images/accessibility-availability-custom-svgrepo-com.svg";

export const Services = (props) => {
  onMount(() => {
    const banners = document.querySelectorAll('.banner');
    banners.forEach((banner) => {
      const bannerWidth = banner.offsetWidth;
      const wrapperWidth = banner.parentElement.offsetWidth;
      const duration = (bannerWidth + wrapperWidth) / 75;
      banner.style.animationDuration = `${duration}s`;
    });
  });

  return (
    <div class="flex justify-between">
      <For each={props.services}>
        {(a, i) => (
            <div class="flex flex-col w-[340px] bg-white shadow-md rounded-lg overflow-hidden">
              <A href={`/service/${a.publicId}`} class="relative">
                <img
                  src={`http://localhost:5555/static/images/xelosani/${props.profId}/services/${a.publicId}/thumbnail/browse/thumbnail.webp`} 
                  fetchpriority="high"
                  height={300}
                  width={340}
                  class="w-full h-[300px] object-cover"
                  alt="Service Thumbnail"
                />
                <span class="absolute z-10 bg-dark-green text-white py-2 px-2 text-xs font-[thin-font] font-bold top-0 left-0">
                  {a.main_category}
                </span>
                <img 
                  loading="lazy"
                  title="სერვისი ხელმისაწვდომია"
                  class="absolute z-20 bg-dark-green text-white py-2 px-4 text-xs font-[thin-font] font-bold rounded-bl-[16px] top-0 right-0"
                  src={avialabilityIcon}
                  alt="Availability Icon"
                />
                <span class="absolute z-10 bg-dark-green text-white py-2 px-2 text-xs font-[thin-font] font-bold rounded-l-[16px] bottom-4 right-0">
                  თქვენთან ახლოს
                </span>
                <div class="banner-wrapper absolute bottom-0 right-0 left-0 z-10 bg-dark-green-hover h-[18px] flex items-center overflow-hidden w-full">
                  <div class="banner flex">
                    <For each={a.categories}>
                      {(cc) => (
                        <span class="text-xs text-white font-[thin-font] font-bold mr-4">
                          {cc}
                        </span>
                      )}
                    </For>
                  </div>
                </div>
              </A>
              <div class="p-4 flex flex-col justify-between h-full gap-y-2">
                <div>
                  <A href={`/service/${a.publicId}`}>
                  <h2 class="border-b border-gray-200 min-h-[55px] pb-1 font-[normal-font] text-gray-900 break-all text-md font-bold">
                    {a.main_title}
                  </h2>
                  </A>
                  <A href={`/service/${a.publicId}`}>
                  <p class="font-[thin-font] text-gr break-all text-xs font-bold">
                    {a.main_description}
                  </p>
                  </A>
                </div>
                <div>
                  <div class="flex items-center justify-between">
                    <p class="my-1 font-[normal-font] font-bold text-dark-green text-sm">
                      ფასი: {a.main_price}₾
                    </p>
                    <Show when={a.ratings}>
                      <div class="flex">
                        <Index each={new Array(a.ratings)}>
                          {() => (
                            <img
                              loading="lazy"
                              src={fullStar}
                              width={18}
                              height={18}
                              alt="Full Star"
                            />
                          )}
                        </Index>
                        <Index each={new Array(5 - a.ratings)}>
                          {() => (
                            <img
                              loading="lazy"
                              src={emptyStar}
                              width={18}
                              height={18}
                              alt="Empty Star"
                            />
                          )}
                        </Index>
                      </div>
                    </Show>
                  </div>
                    <Switch>
                      <Match when={props.status === 401}>
                        <A 
                          href="#"
                          class="bg-dark-green font-[thin-font] text-sm font-bold py-1 hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                        >
                          შეუკვეთე
                        </A>
                      </Match>
                      <Match when={props.status === 200}>
                        <A
                          href={`/xelosani/services?id=${a.publicId}`}
                          class="bg-dark-green font-[thin-font] text-sm font-bold flex items-center gap-x-1 justify-center py-1 hover:bg-dark-green-hover transition ease-in delay-20 text-white text-center rounded-[16px]"
                        >
                          <img loading="lazy" src={EditSVG} alt="Edit" />
                          შეასწორე
                        </A>
                      </Match>
                    </Switch>
                </div>
              </div>
            </div>
        )}
      </For>
    </div>
  );
};
