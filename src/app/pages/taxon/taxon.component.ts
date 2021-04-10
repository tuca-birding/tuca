import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Media, Taxon } from '../../interfaces';
import { SharedService } from '../../services/shared.service';
import { TaxonService } from '../../services/taxon.service';
import { MediaService } from '../../services/media.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-taxon',
  templateUrl: './taxon.component.html',
  styleUrls: ['./taxon.component.scss']
})
export class TaxonComponent implements OnInit {
  taxon: Taxon | undefined;
  mediaList: Media[] = [];

  constructor(
    public router: Router,
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private taxonService: TaxonService,
    private mediaService: MediaService,
    private elRef: ElementRef
  ) {
    this.sharedService.appLabel = 'Taxon';
  }

  ngOnInit(): void {
    this.subscribeToRoute();
    this.sharedService.animateTransition(this.elRef);
  }

  private subscribeToRoute(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // get uid from route
      const taxonUid = params.get('taxonUid');
      if (taxonUid) {
        // if set, query corresponding doc and set property
        this.taxonService
          .getTaxon(taxonUid)
          .then(
            (taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
              this.taxon = taxonDocSnapshot.data();
            }
          );
        this.setMediaList(taxonUid);
      }
    });
  }

  private setMediaList(taxonUid: string): void {
    // get all media matching taxon uid
    this.mediaService
      .getFilteredMediaList('taxonUid', taxonUid)
      .then((mediaQuerySnapshot: firebase.firestore.QuerySnapshot<Media>) => {
        // iterate over each media
        mediaQuerySnapshot.forEach(
          (
            mediaDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Media>
          ) => {
            // push media data to media list
            this.mediaList.push(mediaDocSnapshot.data());
          }
        );
      });
  }
}
