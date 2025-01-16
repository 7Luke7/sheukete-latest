"use server"
import { verify_user } from "../../session_management";
import { CustomError } from "../../utils/errors/custom_errors";
import crypto from "node:crypto";
import { HandleError } from "../../utils/errors/handle_errors";
import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request";
import { fileserver_request } from "../../utils/ext_requests/fileserver_request";

const MAX_SINGLE_FILE_SIZE = 2 * 1024 * 1024;
const MAX_TOTAL_SIZE = 15 * 1024 * 1024;

export async function POST({request}) {
    try {
        const user = await verify_user({request});
        if (user === 401 || user.role === "damkveti") {
          return 401;
        }

        const formData = await request.formData()

        const location = JSON.parse(formData.get("location"))
        const imageLength = formData.get("galleryLength")
        const thumbNail = formData.get("thumbnail")
        const description = formData.get("description")
        const title = formData.get("title")
        const price = formData.get("price")
        const mainCategory = formData.get("mainCategory");
        const parentCategory = formData.get("parentCategory")
        const childCategory = JSON.parse(formData.get("childCategory"))
        const service = JSON.parse(formData.get("service"))
        const schedule = JSON.parse(formData.get("schedule"))

        if (!childCategory || !childCategory.length) {
          throw new CustomError(
            "category",
            "გთხოვთ აირჩიოთ კატეგორია."
          ).ExntendToErrorName("ValidationError");
        }
        if (!thumbNail) {
          throw new CustomError(
            "image",
            "თამბნეილი სავალდებულოა."
          ).ExntendToErrorName("ValidationError");
        }
        if (!imageLength) {
          throw new CustomError(
            "image",
            "გალერეა სავალდებულოა."
          ).ExntendToErrorName("ValidationError");
        }
        if (title.length < 5) {
          throw new CustomError(
            "title",
            "სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს."
          ).ExntendToErrorName("ValidationError");
        }
        if (title.length > 60) {
          throw new CustomError(
            "title",
            "სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს."
          ).ExntendToErrorName("ValidationError");
        }
    
        if (description.length < 20) {
          throw new CustomError(
            "description",
            "მიმოხილვა უნდა შეიცავდეს მინიმუმ 20 ასოს."
          ).ExntendToErrorName("ValidationError");
        }
        if (description.length > 300) {
          throw new CustomError(
            "description",
            "მიმოხილვა უნდა შეიცავდეს მაქსიმუმ 300 ასოს."
          ).ExntendToErrorName("ValidationError");
        }

        if (!price) {
          throw new CustomError(
            "price",
            `სერვისის ფასი სავალდებულოა.`
          ).ExntendToErrorName("ValidationError");
        }
    
        if (service && service.length) {
          for (let i = 0; i < service.length; i++) {
              if (service[i].title.length < 5) {
                  throw new CustomError(
                    `service.${i}.title`,
                    `${i + 1} ქვესერვისის სათაური უნდა შეიცავდეს მინიმუმ 5 ასოს.`
                  ).ExntendToErrorName("ValidationError");
                }

                if (service[i].title.length > 60) {
                  throw new CustomError(
                    `service.${i}.title`,
                    `${i + 1} ქვესერვისის სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს.`
                  ).ExntendToErrorName("ValidationError");
                }

                if (service[i].description.length < 20) {
                  throw new CustomError(
                    `service.${i}.description`,
                    `${i + 1} ქვესერვისის აღწერა უნდა შეიცავდეს მინიმუმ 20 ასოს.`
                  ).ExntendToErrorName("ValidationError");
                }

                if (service[i].description.length > 300) {
                  throw new CustomError(
                    `service.${i}.description`,
                    `${i + 1} ქვესერვისის აღწერა უნდა შეიცავდეს მაქსიმუმ 300 ასოს.`
                  ).ExntendToErrorName("ValidationError");
                }
        
                if (!service[i].price) {
                  throw new CustomError(
                    `service.${i}.price`,
                    `${i + 1} ქვესერვისის ფასი სავალდებულოა.`
                  ).ExntendToErrorName("ValidationError");
                }

              // const random_id = crypto.randomUUID();
              // service[i]["publicId"] = random_id;
              // service[i]["childCategory"] = childCategory;
              // service[i]["parentCategory"] = parentCategory
          }
        }

        const tags = ["mock"]

        const response = await postgresql_server_request(
          "POST",
          "xelosani/service",
          {
            body: JSON.stringify({
              _creator: user.userId,
              categories: [...childCategory, mainCategory, parentCategory],
              tags: tags,
              location,
              mainTitle: title,
              mainCategory: mainCategory,
              availability: schedule,
              mainDescription: description,
              mainPrice: price
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        let count = 0;

        if (response.status === 200) {
          if (thumbNail.size > MAX_SINGLE_FILE_SIZE) {
            throw Error(`${current_image.name}, ფაილის ზომა აჭარბებს 2მბ ლიმიტს.`);
          } 

          for (let i = 0; i < imageLength; i++) {
            const current_image = formData.get(`service-${i}-gallery-image`)
            if (current_image.size > MAX_SINGLE_FILE_SIZE) {
              throw Error(`${current_image.name}, ფაილის ზომა აჭარბებს 2მბ ლიმიტს.`);
            }
            count += current_image.size;
            if (count > MAX_TOTAL_SIZE) {
              throw Error("ფაილების ჯამური ზომა აჭარბებს 15მბ ერთობლივ ლიმიტს.");
            }
          }

          formData.delete("schedule")
          formData.delete("service")
          formData.delete("childCategory")
          formData.delete("price")
          formData.delete("title")
          formData.delete("mainCategory")
          formData.delete("files[]")
          formData.delete("location")
          formData.delete("description")
          formData.delete("parentCategory")

          const file_server_response = fileserver_request("POST", `service/${user.userId}/${response.id}`, {
            body: formData,
          })

          if (file_server_response.status === 200) {
            
          }
        }
    
    /*          
    const compressed_buffer = await compress_image(buffer, 50, 600, 400); // mobile has to be added
    `${service_post.publicId}-${i}`
    */
    
        return {
            status: 200
        };
      } catch (error) {
        if (error.name === "ValidationError") {
          const errors = new HandleError(error).validation_error();
          return {
            errors,
            status: 400,
          };
        } else {
          console.log("add_service_error: ", error);
          return {
            status: 500,
          };
        }
      }
}