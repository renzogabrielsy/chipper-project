import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Box from "./Box";
import Button from "./Button";
import { signOut } from "@/lib/supabase";
import { FaSpotify } from "react-icons/fa";

interface IFormData {
  name: string;
  email: string;
  message?: string;
}

const ContactForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>();

  const onSubmit = async (data: IFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://formspree.io/f/mzblgong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        console.log("Form successfully sent");
        setIsSubmitted(true);
      } else {
        console.error("Error sending form");
      }
    } catch (error) {
      console.error("There was an error sending the form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
    console.log("User is logged out.");
  };

  const redirectToRenzoSpotify = () => {
    window.open(
      "https://open.spotify.com/artist/4rfbCfMiXIqYNOII8JJFbB?si=8kLwrgjlS4mUxdjvrcYfEA",
      "_blank"
    );
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : isSubmitted ? (
        <Box className="flex flex-col gap-y-3 rounded-md p-2 mt-10 bg-white">
          <h1 className="text-3xl font-bold text-center">
            Thank you for the message!
          </h1>
          <h1 className="px-2 text-sm">{`I'll get back to you in a couple of days. In the meantime, 
          you can always stream all of my music directly on Spotify!`}</h1>
          <Button className="flex flex-row justify-center items-center" onClick={redirectToRenzoSpotify}>
            <FaSpotify className="mr-2" />
            <p>Renzo Sy on Spotify</p>
          </Button>
          <Button className=" bg-red-500" onClick={handleLogout}>
            Exit
          </Button>
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="flex flex-col gap-y-3 rounded-md p-0 bg-white">
            <input
              {...register("name", { required: true })}
              placeholder="Your Name"
              className="rounded-md bg-white p-1 border-2 border-gray-300"
            />
            {errors.name && <span>This field is required</span>}
            <input
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              placeholder="Your Spotify Email"
              className="rounded-md bg-white p-1 border-2 border-gray-300"
            />
            {errors.email && (
              <span>This field is required and should be a valid email</span>
            )}
            <textarea
              {...register("message")}
              placeholder="Your personal message (optional)"
              className="rounded-md bg-white p-1 border-2 border-gray-300 h-40"
            />
            <Button className=" bg-orange-500" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
