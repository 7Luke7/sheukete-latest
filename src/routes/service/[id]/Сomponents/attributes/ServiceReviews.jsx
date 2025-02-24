import { createEffect, createSignal, For, Show } from "solid-js"

/*
    კომონენტის ჩატვირთვისას უნდა შევამოწმოთ 
        1. არის თუ არა მომხმარებელი დამკვეთი
            --- მომხმარებელი დამკვეთია ---
                1. შევამოწმოთ აქვს თუ არა სერვისი აქამდე გამოწერილი
                    --- აქვს გამოწერილი ---
                        ----- მივცეთ უფლება დაწეროს განხილვა
                    --- არ აქვს გამოწერილი ---
                        ----- გამოვიტანოთ მესიჯი რო მომხმარებელს არ შეუძლია დაწეროს განხილვა
                        ----- ასევე გამოვიტანოთ განხილვები სხვების მიერ დაწერილი

            --- მომხმარებელი არ არის დამკვეთი
                1. გამოვიტანოთ განხილვები სხვების მიერ დაწერილი
*/
export const ServiceReviews = () => {
    const [reviews, setReviews] = createSignal()

    createEffect(async () => {

    })
    
    return <>
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold mb-2">გამოხმაურებები</h2>
      <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow text-sm">
        დაწერე შეფასება
      </button>
    </div>
    <Show
      when={reviews && reviews.length > 0}
      fallback={<p class="mt-4 text-gray-600">No reviews yet.</p>}
    >
      <div class="mt-4 space-y-4">
        <For each={reviews}>
          {(review) => (
            <div class="p-4 bg-gray-50 rounded shadow">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="font-bold text-gray-800">
                    {review.reviewer}
                  </span>
                  <div class="flex ml-3">
                    {Array(parseInt(review.rating))
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          class="w-4 h-4 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.175 0l-3.37 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.98 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                        </svg>
                      ))}
                  </div>
                </div>
                <span class="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p class="mt-2 text-gray-600">{review.comment}</p>
            </div>
          )}
        </For>
      </div>
    </Show>
  </>
}