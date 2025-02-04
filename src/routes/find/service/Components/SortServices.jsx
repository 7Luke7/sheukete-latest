import { For } from "solid-js";

export const SortServices = (props) => {
  const options = [
    { name: "დამატების თარიღი: ახლიდან ძველამდე", value: "ახლიდან ძველამდე" },
    { name: "დამატების თარიღი: ძველიდან ახალამდე", value: "ძველიდან ახალამდე" },
    { name: "ფასი: მაღლიდან დაბალზე", value: "მაღლიდან დაბალზე" },
    { name: "ფასი: დაბლიდან მაღალზე", value: "დაბლიდან მაღალზე" },
    { name: "მდებარეობა: ყველაზე ახლოს", value: "ყველაზე ახლოს" },
    { name: "რეიტინგი: მაღალი დან დაბალზე", value: "რეიტინგი" },
    { name: "შესრულებული: ყველაზე მეტი", value: "ყველაზე მეტი" },
  ];

  const handleSorting = (e) => {
    const sp = new URLSearchParams(props.currentSearchURL);
    if (e.target.value === "ყველაზე ახლოს") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          sp.set(
            "sort",
            `lng.${position.coords.longitude},lat.${position.coords.latitude}`
          );
          return (window.location.search = sp.toString());
        });
      }
    } else {
      sp.set("sort", e.target.value);
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
            selected={opt.value === props.currentSearchParams.sort}
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
