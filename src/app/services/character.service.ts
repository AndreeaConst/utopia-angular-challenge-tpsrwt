import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, Observable, Subject } from "rxjs";
import { Character } from "../models/character.model";

@Injectable({providedIn: 'root'})
export class CharacterService {
  charactersList$: Subject<Character[]> = new Subject();

  constructor(private http: HttpClient){}

  requestCharacterAndEpisodes(character): Observable<any[]> {
    const episodesUrlArray = [];

    character.episode.forEach((epUrl) => {
      episodesUrlArray.push(epUrl.slice(-2).replace('/', ''));
    });

    let getCharacterInfo = this.http.get(
      'https://rickandmortyapi.com/api/character/1'
    );
    let getEpisodeList = this.http.get(
      `https://rickandmortyapi.com/api/episode/${episodesUrlArray}`
    );

    return forkJoin([getCharacterInfo, getEpisodeList]);
  }

  getCharacterInEpisodes(charactersList) {
    const charactersUrlArray = [];

    charactersList.forEach((characterUrl) => {
      charactersUrlArray.push(characterUrl.slice(-2).replace('/', ''));
    });

    let characterEpisodes = this.http.get(
      `https://rickandmortyapi.com/api/character/${charactersUrlArray}`
    );

    forkJoin([characterEpisodes]).subscribe((results: any[]) => {
      this.charactersList$.next(results[0])
    });
  }
}