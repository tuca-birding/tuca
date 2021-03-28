import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInModalComponent } from './sign-in-modal/sign-in-modal.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { UserDrawerComponent } from './components/user-drawer/user-drawer.component';
import { UploadComponent } from './upload/upload.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { TaxonComponent } from './taxon/taxon.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { MediaCardComponent } from './components/media-card/media-card.component';
import { TaxonListComponent } from './taxon-list/taxon-list.component';
import { AppBarComponent } from './components/app-bar/app-bar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MediaComponent } from './media/media.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInModalComponent,
    UserDrawerComponent,
    UploadComponent,
    EmptyStateComponent,
    TaxonComponent,
    PageHeaderComponent,
    MediaCardComponent,
    TaxonListComponent,
    AppBarComponent,
    NavBarComponent,
    MediaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
