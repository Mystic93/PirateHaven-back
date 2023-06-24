import { Types } from "mongoose";
export interface PirateStructure {
  name: string;
  bounty: number;
  hasDevilFruit: boolean;
  isAlive: boolean;
  imgUrl: string;
  crew: string;
  position: string;
  dream: string;
}

export interface PirateDataStructure extends PirateStructure {
  _id: Types.ObjectId;
}

export const piratesMock: PirateDataStructure[] = [
  {
    _id: new Types.ObjectId("6474bba45626236b1fab3dff"),
    name: "Monkey D. Luffy",
    bounty: 1500000000,
    hasDevilFruit: true,
    isAlive: true,
    imgUrl: "exampel",
    crew: "Straw Hat Pirates",
    position: "Captain",
    dream: "Find the One Piece",
  },
  {
    _id: new Types.ObjectId("6474bba45626236b1fab3e00"),
    name: "Roronoa Zoro",
    bounty: 320000000,
    hasDevilFruit: false,
    isAlive: true,
    imgUrl: "example",
    crew: "Straw Hat Pirates",
    position: "Swordsman",
    dream: "Become the World's Greatest Swordsman",
  },
];

export const luffyMock: PirateStructure = {
  name: "luffy",
  bounty: 1500000000,
  hasDevilFruit: true,
  isAlive: true,
  imgUrl: "exampel",
  crew: "Straw Hat Pirates",
  position: "Captain",
  dream: "Find the One Piece",
};
