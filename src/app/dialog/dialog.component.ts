import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { forkJoin, Observable, Subject } from 'rxjs';
import { Character } from '../models/character.model';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Character,
    private dialogRef: MatDialogRef<DialogComponent>,
    public characterService: CharacterService
  ) {}

  panelOpenState: boolean;
  characterInfo: any;
  episodeList: any;

  get character() {
    return this.data['c'];
  }

  goToSearch(name: string) {
    this.dialogRef.close(name);
  }

  ngOnInit() {
    this.characterService.requestCharacterAndEpisodes(this.character).subscribe((responseList) => {
      this.characterInfo = responseList[0];

      if (responseList[1].length === undefined) {
        this.episodeList = [responseList[1]];
      } else {
        this.episodeList = responseList[1];
      }
    });
  }

  getCharacterInEpisodes(charactersList) {
    this.characterService.getCharacterInEpisodes(charactersList);
  }
}
