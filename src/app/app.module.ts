import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInModalComponent } from './components/sign-in-modal/sign-in-modal.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { UserDrawerComponent } from './components/user-drawer/user-drawer.component';
import { UploadComponent } from './pages/upload/upload.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { TaxonComponent } from './pages/taxon/taxon.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { MediaCardComponent } from './components/media-card/media-card.component';
import { TaxonListComponent } from './pages/taxon-list/taxon-list.component';
import { AppBarComponent } from './components/app-bar/app-bar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MediaComponent } from './pages/media/media.component';
import { UserComponent } from './pages/user/user.component';
import { HomeComponent } from './pages/home/home.component';
import { SuggestionCardComponent } from './components/suggestion-card/suggestion-card.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EditMediaModalComponent } from './pages/media/edit-media-modal/edit-media-modal.component';

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
    MediaComponent,
    UserComponent,
    HomeComponent,
    SuggestionCardComponent,
    EditMediaModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
