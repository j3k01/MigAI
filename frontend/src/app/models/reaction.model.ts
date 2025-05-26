export enum ReactionType
{
    Like = 1,
    G = 2,
    POG = 3,
    Stinky = 4
}

export interface Reaction {
  id: number;
  type: ReactionType;
  notificationId: number;
  userId: number;
}