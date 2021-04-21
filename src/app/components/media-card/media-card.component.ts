import { Component, Input, OnInit } from '@angular/core';
import { Media, User, Taxon } from 'src/app/interfaces';
import { TaxonService } from 'src/app/services/taxon.service';
import { UserService } from 'src/app/services/user.service';
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

  constructor(
    private userService: UserService,
    private taxonService: TaxonService
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
}
