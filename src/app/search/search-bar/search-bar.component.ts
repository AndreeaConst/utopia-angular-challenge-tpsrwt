import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Character } from '../../models/character.model';
import { HttpRequest } from '../../models/http-request.model';
import { HttpDatabase } from '../../services/httpdatabase.service';
import { take } from 'rxjs/operators';
import { MatRadioChange } from '@angular/material/radio';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  characters$: Observable<any>;
  characterDataSource: MatTableDataSource<Character>;
  characterDatabase = new HttpDatabase(this.httpClient);
  searchTerm$ = new BehaviorSubject<string>('');
  resultsEmpty$ = new BehaviorSubject<boolean>(false);
  status = '';
  resultsLength = 0;

  filterFormGroup: FormGroup;
  searchField = new FormControl('');

  orderBySelect: string;

  constructor(
    private httpClient: HttpClient, 
    private fb: FormBuilder,
    public characterService: CharacterService) {}

  ngOnInit() {
    this.filterFormGroup = this.fb.group({});
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.characterDatabase
        .getCharacters('', '', this.paginator.pageIndex)
        .subscribe((response: HttpRequest) => {
          this.characterDataSource = new MatTableDataSource(
            response.results as any[]
          );

          const filterValue = this.status;
          this.characterDataSource.filter = filterValue.trim().toLowerCase();
          this.characterDataSource.filteredData = response.results;

          this.resultsLength = response.info?.count;

          this.characters$ = this.characterDataSource.connect();

          this.sort();
        });
    });
  }

  loadData() {
    this.characterDatabase
      .search(this.searchTerm$)
      .subscribe((response: HttpRequest) => {
        if (!response.info || !response.results) {
          this.resultsEmpty$.next(true);
          return;
        }
        this.resultsEmpty$.next(false);
        this.resultsLength = response.info?.count;
        this.characterDataSource = new MatTableDataSource(
          response.results as any[]
        );

        if(this.status){
          const filterValue = this.status;
          this.characterDataSource.filter = filterValue.trim().toLowerCase();
          this.resultsLength = this.characterDataSource.filteredData?.length;
        } else {
          this.resultsLength = response.info?.count;
        }


        this.characterDataSource.paginator = this.paginator;

        this.characters$ = this.characterDataSource.connect();
      });
  }

  applyFilter() {
    const filterValue = this.status;
    this.characterDataSource.filter = filterValue.trim().toLowerCase();
    this.characterDataSource.paginator = this.paginator;
    if (this.characterDataSource.paginator) {
      this.characterDataSource.paginator.firstPage();
    }

    this.characterDatabase
      .getCharacters(
        this.searchField.value,
        this.characterDataSource.filter,
        this.characterDataSource.paginator.pageIndex
      )
      .pipe(take(1))
      .subscribe((response: HttpRequest) => {
        this.characterDataSource = new MatTableDataSource(
          response.results as any[]
        );

        this.resultsLength = response.info?.count;

        this.characters$ = this.characterDataSource.connect();
      });
  }

  onClear() {
    this.searchField.patchValue('');
    this.searchTerm$.next(''); 
    this.status = '';
  }

  sort(event?: MatRadioChange){
    let select = event? event.value : this.orderBySelect;

    switch(select) {
      case "firstAppearance": {
        this.orderBySelect = "firstAppearance";

        let pilotEpisodeCharacters: Character[] = [];
        this.characterDataSource.filteredData.forEach(character => {
          this.characterService.requestCharacterAndEpisodes(character).pipe(
            map(responseList => {
              let episodeList;

              if (responseList[1].length === undefined) {
                episodeList = [responseList[1]];
              } else {
                episodeList = responseList[1];
              }

              pilotEpisodeCharacters.push(Object.assign(character, {pilotEpisode: episodeList[0]?.episode}));

              pilotEpisodeCharacters.sort((c1, c2) => c1.pilotEpisode.localeCompare(c2.pilotEpisode));

              this.characterDataSource.connect().next(pilotEpisodeCharacters);

              this.characters$ = this.characterDataSource.connect();
            })).subscribe();
        })
        
        break;
      }
      
      case "name": {
        this.orderBySelect = "name";

        this.characterDataSource.filteredData.sort((c1,c2) => c1.name.localeCompare(c2.name));

        this.characterDataSource.connect().next(this.characterDataSource.filteredData);

        this.characters$ = this.characterDataSource.connect();
        break;
      }
    }

  }

  ngOnDestroy() {
    if (this.characterDataSource) {
      this.characterDataSource.disconnect();
    }
  }
}
