import { A } from "@solidjs/router";
import { For } from "solid-js";

export const SignleServiceRenderer = (props) => {
  const { s, i } = props;

  /*
   
    -- About Alignment of category breadcrumbs with description --
      
      We should track length of description and based on that render certain amount of total
      categories and each category should be certain length based on other dependencies 
  
  */
  return (
    <div key={i()} class="w-full mx-auto p-2">
      <div class="bg-white shadow-md rounded-lg overflow-hidden h-[300px] flex flex-col md:flex-row">
        <A class="w-[300px] h-[300px]" href={`/service/${s.publicId}`}>
          <img
            class="w-full h-full"
            width={300}
            height={300}
            src={s.thumbnail_src}
            alt={s.main_title}
            fetchpriority="high"
          />
        </A>

        <div class="md:w-11/12 p-2 flex flex-col relative justify-between">
          <div>
            <div class="flex justify-between items-start">
              <A href={`/service/${s.publicId}`}>
                <h2 class="text-lg font-bold text-gray-800">
                  {s.main_title.slice(0, 50)}...
                </h2>
              </A>
              {s.place_name_ka && (
                <span class="bg-green-600 absolute opacity-[0.9] right-2 top-0 text-white text-xs font-semibold font-[thin-font] px-2 py-1 rounded-full">
                  {s.place_name_ka.slice(0, 50)}...
                </span>
              )}
            </div>

            <A href={`/service/${s.publicId}`}>
              <p class="mt-2 text-xs font-[normal-font] text-gray-600">
                {s.main_description.slice(0, 250)}...
              </p>
            </A>
            <p class="mt-2 text-gray-800 font-[bolder-font] text-xs">
              {s.main_category}
            </p>

            <div class="mt-1 flex flex-wrap gap-1">
              <For each={s.categories.filter((_, i) => i < 6)}>
                {(sc) => (
                  <span class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-[thin-font] font-semibold">
                    {sc.slice(0, 20)}...
                  </span>
                )}
              </For>
            </div>
          </div>

          <div class="mt-4 flex justify-between items-center border-t pt-2">
            <div class="flex gap-x-2">
              <div class="flex flex-col items-start p-2 bg-gray-50 rounded-lg shadow-sm">
                <A href={`/service/${s.publicId}`}>
                  <p class="text-lg font-[normal-font] font-semibold text-gray-900">
                    ₾
                    {s.main_price}
                  </p>
                </A>
                <p class="mt-1 text-xs font-[normal-font] text-gray-500">
                  გამოქვეყნდა: {s.display_created_at}
                </p>
              </div>

              <div class="flex flex-col items-start p-2 bg-gray-50 rounded-lg shadow-sm">
                <A href={`/service/${s.publicId}`}>
                  <p class="text-lg font-bold text-gray-900">
                    {s.avgrating}
                  </p>
                </A>
                <p class="mt-1 text-xs font-[normal-font] text-gray-500">
                  შესრულებული: {s.completed_count}
                </p>
              </div>
            </div>

            <A
              href={`/xelosani/${s.profId}`}
              class="flex items-center bg-green-500 hover:bg-green-600 transition-colors text-white px-3 py-2 rounded-lg"
            >
              <img
                class="w-12 h-12 rounded-full mr-3"
                src={s.prof_pic_src}
                loading="lazy"
                alt="Professional"
              />
              <div class="flex flex-col">
                <p class="text-sm font-semibold">
                  {s.firstname + " " + s.lastname}
                </p>
                <p class="text-xs">
                  სამუშაოები: {s.completed_jobs}
                </p>
                <p class="text-xs">საშუალო: {s.avgrating}</p>
              </div>
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};
