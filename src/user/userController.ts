import { RequestHandler } from "express";
import { getUserProfile } from "./userServices";

export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    const { id, email } = res.locals.user;

    const profile = await getUserProfile(id);

    res.status(200).json({
      id,
      email,
      name: profile.name,
      lastName: profile.last_name,
      avatar: profile.photo_url,
      age: profile.age,
      gender: profile.gender?.name ?? null,
      location: profile.location,
    });
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
};
