import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "kuro-app" });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    let username = email_addresses[0].email_address.split("@")[0];

    // Check availability of username
    const user = await User.findOne({ username });

    if (user) {
      username += Math.floor(Math.random() * 10000);
    }

    let full_name
    if (last_name !== null) {
      full_name = first_name + " " + last_name
    } else {
      full_name = first_name
    }

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name,
      profile_picture: image_url,
      username,
      isPrivate: false,
    };

    await User.create(userData);
  }
);

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    let full_name
    if (last_name !== null) {
      full_name = first_name + " " + last_name
    } else {
      full_name = first_name
    }

    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name,
      profile_picture: image_url,
    };

    await User.findByIdAndUpdate(id, updatedUserData);
  }
);

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
