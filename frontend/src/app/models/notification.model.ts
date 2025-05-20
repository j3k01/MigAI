export interface Notification 
{
    id: number;
    title: string;
    content: string;
    date: string;
    reactions: { [key: string]: number };
    comments: string[];
    newComment?: string;
}