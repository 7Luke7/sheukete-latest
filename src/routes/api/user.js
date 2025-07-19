"use server"
import { getRequestEvent } from "solid-js/web";
import { json } from "@solidjs/router";
import { verify_user } from "./session_management";
import { hide_email, hide_mobile_number } from "./utils/hide/mail";
import { postgresql_server_request } from "./utils/ext_requests/posgresql_server_request";
import { delete_key } from "./redis/utils";

export const get_account = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    if (session.role === "xelosani") {
      const data = await postgresql_server_request("POST", `account`, {
        body: JSON.stringify({
          userId: session.userId,
          role: session.role
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } else if (session.role === "damkveti") {
      const user = await Damkveti.findById(
        session.userId,
        "-_id -__v -skills -updatedAt -notificationDevices -createdAt -password -gender -date -about -stepPercent -profId"
      );
      return JSON.stringify(user._doc);
    } else {
      throw new Error("როლი არ არსებობს.");
    }
  } catch (error) {
    if (error.message === "401") {
      return 401;
    }
  }
}

export const get_xelosani = async (prof_id) => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);
    if (session.profId !== prof_id) {
      throw new Error(`401%${session.userId}%${session.role}%${session.profId}`); // temporary
    }

    const user = await postgresql_server_request("GET", `xelosani/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    let displayBirthDate;
    if (user.date) {
      displayBirthDate = new Date(user["date"]).toLocaleDateString("ka-GE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    const creationDateDisplayable = getTimeAgo(user.created_at);

    // we could make postgresql trigger function
    // which will trigger after user updates their privacy
    // and automatically make changes to these to not have to do it manually
    const keys = Object.keys(user.privacy);
    for (let i = 0; i < keys.length; i++) {
      if (user.privacy[keys[i]] === "ნახევრად დამალვა") {
        if (keys[i] === "email" && user.email) {
          user["email"] = hide_email(user.email);
        }
        if (keys[i] === "phone" && user.phone) {
          user["phone"] = hide_mobile_number(user.phone);
        }
      }
    }

    return {
      profId: session.profId,
      ...user,
      skillset: user.skillset[0],
      displayBirthDate,
      creationDateDisplayable,
      status: 200,
    };
  } catch (error) {
    if (error.message.split("%")[0] === "401") {
      const viewer_id = error.message.split("%")[1]
      const role = error.message.split("%")[2]
      const viewer_prof_id = error.message.split("%")[3]
      const user = await postgresql_server_request("GET", `xelosani/not_authorized/${prof_id}?viewer_id=${viewer_id || undefined}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
        
      let displayBirthDate;
      if (user.date) {
        displayBirthDate = new Date(user["date"]).toLocaleDateString("ka-GE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
  
      const creationDateDisplayable = getTimeAgo(user.created_at);
  
      const keys = Object.keys(user.privacy);
      for (let i = 0; i < keys.length; i++) {
        if (user.privacy[keys[i]] === "ნახევრად დამალვა") {
          if (keys[i] === "email" && user.email) {
            user["email"] = hide_email(user.email);
          }
          if (keys[i] === "phone" && user.phone) {
            user["phone"] = hide_mobile_number(user.phone);
          }
        }
      }
  
      return {
        ...user,
        viewer_prof_id: viewer_prof_id === "undefined" ? null : viewer_prof_id,
        viewer_role: role,
        skillset: user.skillset[0],
        is_request_sender: user.request_sender_id === viewer_id ? true : null,
        profId: prof_id,
        displayBirthDate,
        creationDateDisplayable,
        status: 401,
      }
  }}
}

export const getTimeAgo = (createdAt) => {
  const now = new Date();
  const creationDate = new Date(createdAt);

  const diffInMs = now - creationDate;

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInYears > 0) {
    return `${diffInYears} წლის უკან`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths} თვის უკან`;
  } else if (diffInDays > 0) {
    return `${diffInDays} დღის უკან`;
  } else if (diffInHours > 0) {
    return `${diffInHours} საათის უკან`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} წუთის უკან`;
  } else {
    return `${diffInSeconds} ახლახანს`;
  }
};

export const logout_user = async () => {
  try {
    const event = getRequestEvent();
    const session = event.request.headers.get("cookie").split("sessionId=")[1];

    await delete_key(`session:${session}`)
    return json("success", {
      status: 200,
      headers: {
        "Set-Cookie": `sessionId=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const toggle_notification = async (target) => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    await postgresql_server_request(
      "PUT",
      `notification_targets`,
      {
          body: JSON.stringify({
              target,
              role: session.role,
              userId: session.userId
          }),
          headers: {
              "Content-Type": "application/json"
          }
      }
    )
  } catch (error) {
    console.log(error);
  }
};

export const get_notification_targets = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const data = await postgresql_server_request("POST", `notification_targets`, {
      body: JSON.stringify({
        userId: session.userId,
        role: session.role
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data.notificationdevices;
  } catch (error) {
    console.log(error);
  }
};

///////////////////////// DAMKVETI ///////////////////////////////////

export const get_damkveti = async (prof_id) => {
  try {
    const event = getRequestEvent();
    const redis_user = await verify_user(event);

    if (redis_user.profId !== prof_id) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("GET", `damkveti/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    let displayBirthDate;
    if (user.date) {
      displayBirthDate = new Date(user["date"]).toLocaleDateString("ka-GE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    const profile_image = await get_user_profile_image(prof_id);
    const creationDateDisplayable = getTimeAgo(user.createdAt);

    const keys = Object.keys(user.privacy);
    for (let i = 0; i < keys.length; i++) {
      if (user.privacy[keys[i]] === "ნახევრად დამალვა") {
        if (keys[i] === "email" && user.email) {
          user["email"] = hide_email(user.email);
        }
        if (keys[i] === "phone" && user.phone) {
          user["phone"] = hide_mobile_number(user.phone);
        }
      }
    }

    let modedJobs;
    if (jobs || jobs.length) {
      modedJobs = await Promise.all(
        jobs.map(async (j, i) => {
          const image = await get_s3_image(`${j.publicId}-job-post-thumbnail`);
          const creationDateDisplayable = getTimeAgo(j.createdAt);

          return {
            ...j,
            createdAt: creationDateDisplayable,
            thumbnail: image,
            profPic: profile_image,
          };
        })
      );
      return {
        ...user,
        jobs: modedJobs,
        displayBirthDate,
        jobCount: jobs.length,
        profile_image,
        creationDateDisplayable,
        status: 200,
      };
    } else {
      return {
        ...user,
        displayBirthDate,
        profile_image,
        creationDateDisplayable,
        status: 200,
      };
    }
  } catch (error) {
    if (error.message === "401") {
      const { jobs, ...user } = await Damkveti.findOne(
        { profId: prof_id },
        "-_id -__v -stepPercent -setupDone -updatedAt -notificationDevices -password"
      )
        .populate("jobs", "-mileStones -_id -__v -updatedAt -_creator")
        .lean();
      let displayBirthDate;
      if (user.date && user.privacy.birthDate !== "private") {
        displayBirthDate = new Date(user["date"]).toLocaleDateString("ka-GE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      const profile_image = await get_user_profile_image(prof_id);
      const creationDateDisplayable = getTimeAgo(user.createdAt);

      const keys = Object.keys(user.privacy);
      for (let i = 0; i < keys.length; i++) {
        if (user.privacy[keys[i]] === "semipublic") {
          if (keys[i] === "email") {
            user["email"] = hide_email(user.email);
          }
          if (keys[i] === "phone") {
            user["phone"] = hide_mobile_number(user.phone);
          }
        } else if (user.privacy[keys[i]] === "private") {
          if (keys[i] === "email") {
            delete user["email"];
          }
          if (keys[i] === "phone") {
            delete user["phone"];
          }
          if (keys[i] === "birthDate") {
            delete user["date"];
          }
        }
      }
      let modedJobs;
      if (jobs) {
        modedJobs = await Promise.all(
          jobs.map(async (j, i) => {
            const image = await get_s3_image(
              `${j.publicId}-job-post-thumbnail`
            );
            const creationDateDisplayable = getTimeAgo(j.createdAt);

            return {
              ...j,
              createdAt: creationDateDisplayable,
              thumbnail: image,
              profPic: profile_image,
            };
          })
        );
        return {
          ...user,
          jobs: modedJobs,
          displayBirthDate,
          jobCount: jobs.length,
          profile_image,
          creationDateDisplayable,
          status: 401,
        };
      } else {
        return {
          ...user,
          displayBirthDate,
          profile_image,
          creationDateDisplayable,
          status: 401,
        };
      }
    }
  }
};

export const setup_done = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const response = await postgresql_server_request("GET", `${session.role}/setup_done/${session.profId}`)

    if (!response.ok) {
      throw new Error("Something went wrong in postgresql server")
    }
    
    return "success"
  } catch (error) {
    console.log(error);
  }
};
