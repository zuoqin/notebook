import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { StoryListComponent } from './story-list.component';
import { StoryDetailComponent } from './story-detail.component';
import { StoryDetailGuard } from './story-guard.service';

import { StoryFilterPipe } from './story-filter.pipe';
import { StoryService } from './story.service';

import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'stories', component: StoryListComponent },
      { path: 'story/:id',
        canActivate: [ StoryDetailGuard],
        component: StoryDetailComponent
      }
    ])
  ],
  declarations: [
    StoryListComponent,
    StoryDetailComponent,
    StoryFilterPipe
  ],
  providers: [
    StoryService,
    StoryDetailGuard
  ]
})
export class StoryModule {}
