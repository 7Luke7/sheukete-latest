import { A } from "@solidjs/router";
import { For } from "solid-js";

export const SignleServiceRenderer = (props) => {
  const { s, i } = props;

  /*
        --- props.services Preview ---
        {
            main_category: 'ზოგადი შეკეთება და მოვლა',
            main_title: 'ლორემ იპსუმ უკვდავყო შავებშია ნადავლი მეყო მოიხდენს სხვაგვარ',
            main_description: 'ლორემ იპსუმ უკვდავყო შავებშია ნადავლი მეყო მოიხდენს სხვაგვარი მოიქცეს, სწამეთ შექმნილ გამასხარავება ინფორმაციაა იტრიალეს. გაგაჩერებენ ამოუფრთხო სწერს დაიკვნესა სახარება უყვიროდა წამოსხმული, ადგულებისთვისაც ვბრჭყვიალა მიუთითებენ ცეცხლისა. ფრანგებთან ხმალი ვბრჭყვიალა ინფორმაციაა, წამოსხმული გადააბავდა',
            main_price: 100,
            categories: [Array],
            publicId: '41b3e910-a0bd-41d1-b344-4d40161e9d9e',
            city: 'თბილისი',
            place_name_ka: 'ქსანის ქუჩა 35, 0141, სანზონა, ნაძალადევის რაიონი, თბილისი, საქართველო',
            center: [Array],
            bbox: [Array],
            longitude: 44.78673322753957,
            region: 'თბილისი',
            street: 'ქსანის ქუჩა',
            latitude: 41.76844595255673,
            neighbourhood: null,
            created_at: '2025-01-30T18:54:16.756649+04:00'
        }
    */

  return (
    <div key={i()} class="w-full mx-auto p-4">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden min-h-80 flex flex-col md:flex-row">
        {/* Image Section */}
        <A class="w-[351px] h-[351px]" href={`/xelosani/${s.profId}`}>
          <img
            class="object-cover w-full h-full"
            src={s.thumbnail_src}
            alt="Service"
          />
        </A>

        {/* Content Section */}
        <div class="md:w-full p-3 flex flex-col relative justify-between">
          {/* Top Section */}
          <div>
            <div class="flex justify-between items-start">
              <A href={`/xelosani/${s.profId}`}>
                <h2 class="text-xl font-bold text-gray-800">{s.main_title}</h2>
              </A>
              {/* Location Badge */}
              {s.place_name_ka && (
                <span class="bg-green-600 absolute right-5 text-white text-xs font-semibold font-[thin-font] px-3 py-1 rounded-full">
                  {s.place_name_ka.slice(0, 60)}...
                </span>
              )}
            </div>

            <A href={`/xelosani/${s.profId}`}>
              <p class="mt-3 text-sm font-[normal-font] text-gray-600">
                {s.main_description}
              </p>
            </A>
            <p class="mt-4 text-gray-800 font-[bolder-font] text-sm">
              {s.main_category}
            </p>

            {/* Categories */}
            <div class="mt-2 flex flex-wrap gap-2">
              <For each={s.categories}>
                {(sc) => (
                  <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-[thin-font] font-semibold">
                    {sc}
                  </span>
                )}
              </For>
            </div>
          </div>

          {/* Bottom Section */}
          <div class="mt-6 flex justify-between items-center border-t pt-4">
            <div class="flex gap-x-4">
              {/* Price & Publication Date */}
              <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg shadow-sm">
                <A href={`/xelosani/${s.profId}`}>
                  <p class="text-2xl font-bold text-gray-900">
                    ₾{s.main_price}
                  </p>
                </A>
                <p class="mt-1 text-xs font-medium text-gray-500">
                  გამოქვეყნდა: {new Date(s.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Average Rating & Completed Count */}
              <div class="flex flex-col items-start p-3 bg-gray-50 rounded-lg shadow-sm">
                <A href={`/xelosani/${s.profId}`}>
                  <p class="text-2xl font-bold text-gray-900">
                    {s.avgrating} 
                    დეველოპმენტის ქვეშ
                  </p>
                </A>
                <p class="mt-1 text-xs font-medium text-gray-500">
                  {s.completed_count}
                  დეველოპმენტის ქვეშ
                </p>
              </div>
            </div>

            <A
              href={`/xelosani/${s.profId}`}
              class="flex items-center bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded-lg"
            >
              <img
                class="w-16 h-16 rounded-full object-cover mr-4"
                src={s.prof_pic_src}
                alt="Professional"
              />
              <div class="flex flex-col">
                <p class="text-sm font-semibold">
                  {s.firstname + " " + s.lastname}
                </p>
                <p class="text-xs">
                  შესრულებული სამუშაოები: {s.completed_jobs}
                </p>
                <p class="text-xs">საშუალო შეფასება: {s.avgrating}</p>
              </div>
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};
