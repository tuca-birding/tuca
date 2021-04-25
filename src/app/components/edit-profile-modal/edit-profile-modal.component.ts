import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from 'src/app/interfaces';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit {
  visible = false;
  editingUser: User | undefined;
  @Output() close = new EventEmitter();

  constructor(
    public sharedService: SharedService,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.visible = true;
    }, 0);
    this.editingUser = this.userService.user;
  }

  handleConfirm(): void {
    console.log('confirm');
  }

  closeModal(): void {
    this.visible = false;
    setTimeout(() => {
      this.close.emit();
    }, 100);
  }

  setNewName(tar: EventTarget | null): void {
    if (this.editingUser) {
      this.editingUser.name = (<HTMLInputElement>tar).value;
    }
  }

}
