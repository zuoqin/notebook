import {  PipeTransform, Pipe } from '@angular/core';
import { IStory } from './story';

@Pipe({
    name: 'storyFilter'
})
export class StoryFilterPipe implements PipeTransform {

    transform(value: IStory[], filterBy: string): IStory[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((story: IStory) =>
            story.title.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}
