import { createSignal } from "solid-js";
import cities from "~/Components/cities.json";

export const LocationFilter = (props) => {
    const [state, setState] = createSignal(props.currentSearchParams.region)
    const [city, setCity] = createSignal(props.currentSearchParams.city)

    return <>
      <div class="flex justify-center flex-col my-2 items-start">
        <h2 class="text-lg text-gray-800 text-center">
          ადგილ-მდებარეობა
        </h2>
      </div>
        <div class="w-full gap-x-5 flex">
          <div class="w-1/2">
            <label
              htmlFor="region"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              მხარე
            </label>
            <div className="mt-1">
              <select
                id="region"
                name="region"
                onChange={(e) => {
                    setState(e.target.value)
                    setCity(() => {
                        return cities.find((c) => c.state === e.target.value).cities[0].name
                    })
                }}
                type="select"
                className="block px-3 w-full rounded-md py-2 text-gray-900
shadow-sm border outline-none focus:ring-2 focus:ring-inset
focus:ring-dark-green sm:text-sm sm:leading-6"
              >
                {cities.map((c, i) => {
                    return (
                    <option selected={c.state === state()} key={i} value={c.state}>
                      {c.state}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div class="w-1/2">
            <label
              htmlFor="city"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              ქალაქი
            </label>
            <div className="mt-1 w-full">
              <select
                id="city"
                name="city"
                onChange={(e) => setCity(e.target.value)}
                type="select"
                className="block px-3 w-full rounded-md py-2 text-gray-900
shadow-sm border outline-none focus:ring-2 focus:ring-inset
focus:ring-dark-green sm:text-sm sm:leading-6"
              >
                {cities
                  .filter((cs) =>
                    cs.state === state()
                  )
                  .map((c, i) => {
                    return c.cities.map((c, index) => {
                      return (
                        <option
                          selected={c.name === city()}
                          key={index}
                          value={c.name}
                        >
                          {c.name}
                        </option>
                      );
                    });
                  })}
              </select>
            </div>
          </div>
        </div>
    </>
}