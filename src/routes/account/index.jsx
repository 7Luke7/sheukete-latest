import { createAsync } from "@solidjs/router";
import { get_account} from "~/routes/api/user";

const Account = () => {
  const user = createAsync(get_account);

  return (
    <div class="flex px-10 items-start gap-x-2">
        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
          <div class="flex flex-col">
            <label for="firstname" class="font-[thin-font] text-xl font-bold">
              სახელი
            </label>
            <p
              class="py-1 px-2 mt-1 outline-0 bg-gray-100 font-[normal-font] text-base"
            >
              {user() && user()?.firstname}
            </p>
          </div>
          <div class="flex flex-col">
            <label for="lastname" class="font-[thin-font] text-xl font-bold">
              გვარი
            </label>
            <p
              class="py-1 px-2 mt-1 outline-0 bg-gray-100 font-[normal-font] text-base"
            >
              {user() &&  user()?.lastname}
            </p>
          </div>
          <div class="flex flex-col">
            <label for="email" class="font-[thin-font] text-xl font-bold">
              მეილი
            </label>
            <p class="py-1 px-2 mt-1 font-[normal-font] bg-gray-100 text-base">
              {user() && user()?.email}
            </p>
          </div>
          <div class="flex flex-col">
            <label for="mobile" class="font-[thin-font] text-xl font-bold">
              მობილური ნომერი
            </label>
            <p class="py-1 px-2 mt-1 font-[normal-font] bg-gray-100 text-base">
              {user() && user()?.phone}
            </p>            
          </div>
        </div>
    </div>
  );
};

export default Account;
