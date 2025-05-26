import { AppComment } from './comment.model';
import { Reaction } from './reaction.model'

export interface Notification 
{
    id: number;
    title: string;
    content: string;
    date: string;
    reactions: Reaction[];
    comments: AppComment[];
    newComment?: string;
}