import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MediaComponent } from './pages/media/media.component';
import { PlaceComponent } from './pages/place/place.component';
import { TaxonListComponent } from './pages/taxon-list/taxon-list.component';
import { TaxonComponent } from './pages/taxon/taxon.component';
import { UploadComponent } from './pages/upload/upload.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
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
  },
  {
    path: 'user/:userUid',
    component: UserComponent
  },
  {
    path: 'place/:placeUid',
    component: PlaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
