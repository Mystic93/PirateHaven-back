import { type Request } from "express";
import { type PirateStructure } from "../mocks/piratesMock";

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserStructure extends UserCredentials {
  _id: string;
}

export type UserCredentialsRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;

export interface UserDataStructure {
  name: string;
  username: string;
  password: string;
}

export interface CustomRequest extends Request {
  userId: string;
  params: { piratesId: string };
  body: PirateStructure;
}
