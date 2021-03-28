import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Media } from '../interfaces';
import firebase from 'firebase/app';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  media: Media | undefined;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.subscribeToRoute();
  }

  private subscribeToRoute(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const mediaUid = params.get('mediaUid');
      if (mediaUid) {
        this.setMedia(mediaUid);
      }
    });
  }

  private setMedia(mediaUid: string) {
    console.log('will get media: ', mediaUid);
    this.firestore
      .collection<Media>('media')
      .doc(mediaUid)
      .get()
      .toPromise()
      .then((mediaDocSnapshot: firebase.firestore.DocumentSnapshot<Media>) => {
        this.media = mediaDocSnapshot.data();
        console.log(this.media);
      });
  }

}
