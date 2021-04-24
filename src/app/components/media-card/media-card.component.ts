import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Media, User, Taxon } from 'src/app/interfaces';
import { TaxonService } from 'src/app/services/taxon.service';
import { UserService } from 'src/app/services/user.service';
import { MediaService } from 'src/app/services/media.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.component.html',
  styleUrls: ['./media-card.component.scss']
})
export class MediaCardComponent implements OnInit {
  @Input() media: Media | undefined;
  @Input() image: string | undefined;
  @Input() icon: string | undefined;
  @Input() header: string | undefined;
  @Input() label: string | undefined;
  @ViewChild('img') imgEl: ElementRef<HTMLImageElement> | undefined;

  constructor(
    public userService: UserService,
    private taxonService: TaxonService,
    private mediaService: MediaService
  ) { }

  ngOnInit(): void {
    if (this.media) {
      this.setMedia();
    }
  }

  setMedia(): void {
    this.image = this.media?.thumbnail;
    // get taxon name and assign to header
    this.taxonService
      .getTaxon(this.media!.taxonUid!)
      .then((taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
        this.header = taxonDocSnapshot.data()?.commonName?.en;
      });
    // get user name and assign to label
    this.userService
      .getUser(this.media!.ownerUid!)
      .then((userDocSnapshot: firebase.firestore.DocumentSnapshot<User>) => {
        this.label = userDocSnapshot.data()?.name;
      });
  }

  setImageFilter(operation: string): void {
    if (operation === 'add') {
      this.imgEl?.nativeElement.classList.add('no-filter');
    } else if (operation === 'remove') {
      this.imgEl?.nativeElement.classList.remove('no-filter');
    }
  }

  getLikeActive(): boolean | undefined {
    return this.userService.user && this.media?.likes?.includes(this.userService.user.uid);
  }

  setUserLike(): void {
    const signedUserUid = this.userService.user?.uid;
    if (signedUserUid) {
      // add or remove like depending on if user already liked it
      this.mediaService.setLikes(this.media!.uid, signedUserUid, this.getLikeActive() ? 'remove' : 'add')
        .then((operation) => {
          const newLikes = this.media?.likes ? this.media.likes : [];
          operation === 'add'
            ? newLikes.push(signedUserUid)
            : newLikes.splice(this.media!.likes.indexOf(signedUserUid), 1);
          this.media!.numLikes = newLikes.length;
        });
    } else {
      // open sign in modal if no user is logged in
      this.userService.signInModalVisible = true;
    }
  }
}
