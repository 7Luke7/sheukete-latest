import { For } from "solid-js";

export const SortServices = (props) => {
  const options = [
    { name: "დამატების თარიღი: ახლიდან ძველამდე", value: "created_at-DESC" },
    { name: "დამატების თარიღი: ძველიდან ახალამდე", value: "created_at-ASC" },
    { name: "ფასი: მაღლიდან დაბალზე", value: "main_price-DESC" },
    { name: "ფასი: დაბლიდან მაღალზე", value: "main_price-ASC" },
    { name: "მდებარეობა: ყველაზე ახლოს", value: "longitude-latitude-ASC" },
    { name: "რეიტინგი: მაღალი დან დაბალზე", value: "avgrating-DESC" },
    { name: "შესრულებული: ყველაზე მეტი", value: "completed_count-DESC" },
  ];

  const handleSorting = (e) => {
    const sp = new URLSearchParams(props.currentSearchURL);
    if (e.target.value === "longitude-latitude-ASC") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          sp.set(
            "sort",
            `longitude.${position.coords.longitude},latitude.${position.coords.latitude}`
          );
          sp.delete(`lastservice-${props.sort.split("-")[0]}`)
          sp.delete("lastservice-pid")
          return (window.location.search = sp.toString());
        });
      }
    } else {
      sp.delete(`service-${props.sort.split("-")[0]}`)
      sp.delete("service-pid")
      sp.set("sort", e.target.value);
      sp.set("page", 1)
      return (window.location.search = sp.toString());
    }
  };
  return (
    <select
      onChange={handleSorting}
      class="block px-3 w-[400px] rounded-md py-1 text-gray-900
shadow-sm border font-[thin-font] font-bold outline-none focus:ring-2 focus:ring-inset
focus:ring-dark-green sm:text-xs sm:leading-6 mb-1"
    >
      <For each={options}>
        {(opt, i) => (
          <option
            key={i()}
            selected={opt.value === props.sort}
            class="font-[thin-font] font-bold text-xs"
            value={opt.value}
          >
            {opt.name}
          </option>
        )}
      </For>
    </select>
  );
};
