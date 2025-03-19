import dropdownGreenSVG from "../../../svg-images/svgexport-13.svg"
import { A } from "@solidjs/router";

export const MainFriends = () => {
    return <>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">
      მეგობრები
    </h1>
    <div class="flex flex-col gap-y-3">
    <A href="/friends" class="bg-white hover:bg-gray-100 rounded-lg shadow">
      <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <span class="text-lg font-[normal-font] text-gray-700">
          მთავარი
        </span>
        <button>
            <img width={26} src={dropdownGreenSVG} alt="More options"></img>
        </button>
      </div>
    </A>
    <A href="requests" class="bg-white rounded-lg hover:bg-gray-100 shadow">
      <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <span class="text-lg font-[normal-font] text-gray-700">
          მეგობრობის მოთხოვნები
        </span>
        <button>
            <img width={26} src={dropdownGreenSVG} alt="More options"></img>
        </button>
      </div>
    </A>
    <A href="all" class="bg-white rounded-lg hover:bg-gray-100 shadow">
      <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <span class="text-lg font-[normal-font] text-gray-700">
          ყველა მეგობრები
        </span>
        <button>
            <img width={26} src={dropdownGreenSVG} alt="More options"></img>
        </button>
      </div>
    </A>
    <A href="/mayknow" class="bg-white hover:bg-gray-100 rounded-lg shadow">
      <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <span class="text-lg font-[normal-font] text-gray-700">
          შესაძლოა იცნობდეთ
        </span>
        <button>
            <img width={26} src={dropdownGreenSVG} alt="More options"></img>
        </button>
      </div>
    </A>
  </div>
  </>
}