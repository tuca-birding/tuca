import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaComponent } from './media/media.component';
import { TaxonListComponent } from './taxon-list/taxon-list.component';
import { TaxonComponent } from './taxon/taxon.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'upload',
    pathMatch: 'full'
  },
  {
    path: 'upload',
    component: UploadComponent
  },
  {
    path: 'taxon-list',
    component: TaxonListComponent
  },
  {
    path: 'taxon/:taxonUid',
    component: TaxonComponent
  },
  {
    path: 'media/:mediaUid',
    component: MediaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
