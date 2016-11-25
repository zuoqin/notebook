/* Defines the story entity */
export interface IStory {
    _id: string;
    title: string;
    introduction: string;
    modified: Date;
    topic: string;
    creator: string;
    content: string;
}

