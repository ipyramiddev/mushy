import React from "react";
import { Page } from "../../components/Page";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {DISCORD_FEEDBACK_URL} from "../../constants/urls";


export const FeedbackView = () => {
  let history = useHistory();

  async function postFeedback(data:any){
    const response = await fetch(
  DISCORD_FEEDBACK_URL,
  {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }
)
  .then((response)=>{
    if (response.ok){
      return response
    }
    else{
      throw new Error("An Error occured");
    }

  });
  }

  const { register, handleSubmit, formState : { errors } } =useForm();

  return (
    <Page title="Feedback | DigitalEyes">
    <div className="flex justify-center">
      <div className="flex flex-col bg-color-main-primary shadow-xl transform transition-all sm:my-8 sm:max-w-full sm:max-w-xl md:max-w-3xl w-full sm:p-6 border border-color-border">
        <div className="px-4 sm:px-2 lg:px-8 text-2xl md:text-4xl uppercase font-black py-4 md:py-6 mx-auto text-center">
          SUBMIT FEEDBACK
        </div>
        <div>
          <form onSubmit={handleSubmit((data) => {
            postFeedback(data)
              .then(response=>{
                toast('🦄 Feedback sent. Thank you!', {
                    position: "top-right",
                      autoClose: 7000,
                      });
                history.push('/')

              })
              .catch(Error=>{
                toast.error('Something went wrong. Please try again!', {
                    position: "top-right",
                      autoClose: 7000,
                      });
              })
              }
              )
          }>
          <div className="flex flex-col mb-5">
          <label
            className="uppercase text-lg sm:text-xl m-5 ">
            Contact Info
            </label>
          <input
            {...register("contact_info" , { required : true}
            )}
            id="contact_info"
            placeholder="Discord ID or email here"
            className="bg-color-main-primary border-solid rounded-md border-2 shadow-sm mx-5"
              />
              <div className="mx-5 text-red-900">
              {errors.contact_info?.type ==='required' && "We need this incase we need to get in touch with you! You get it..."}
              </div>
          <label
            className="uppercase text-lg sm:text-xl m-5 ">
            Feedback
            </label>
          <textarea
            {...register("feedback" , { required : "You forgot say what's on your mind...",
              maxLength: {value:5000, message:"Only 5000 characters max"}})}
            id="feedback"
            placeholder="Go on... Pour your heart out champion <3"
            className="bg-color-main-primary border-solid rounded-md border-2 shadow-sm mx-5"
            />
            <div className="mx-5 text-red-900">
            {errors.feedback && <p>{errors.feedback.message}</p>}
            </div>

          <input
            type="submit"
            value="Submit & Return Home"
            className="m-5 appearance-none disabled:opacity-50 duration-150 ease-in border border-color-border px-8 md:px-4 py-2 bg-almost-black text-xs sm:text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 uppercase"

            />

          </div>

          </form>
        </div>
      </div>
    </div>
    <ToastContainer

/>
    </Page>
  );
};
