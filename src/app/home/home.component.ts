import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { Player } from '../models/player';
import { Team } from '../models/team';

@Component({
  selector: 'fpl-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private teams: Team[] = [];
  private selectedFilter = 'ALL';
  private selectedSort = 'POINTS';

  public players: Player[] = [];
  public get filteredPlayers(): Player[] {
    let players: Player[];
    if (this.selectedFilter === 'ALL') {
      players = this.players;
    } else {
      players = this.players.filter(p => p.position === this.selectedFilter);
    }
    return this.sortPlayers(players);
  }

  constructor(private dataService: DataService) { }

  private sortPlayers(players: Player[]): Player[] {
    let sortedPlayers = players;

    if (this.selectedSort === 'POINTS') {
      sortedPlayers = players.sort((p1, p2) => p2.points - p1.points);
    } else if (this.selectedSort === 'PRICE') {
      sortedPlayers = players.sort((p1, p2) => p2.currentPrice - p1.currentPrice);
    }

    return sortedPlayers;
  }

  public filterClass(filter: string): string {
    return filter === this.selectedFilter ? 'is-selected is-info' : '';
  }

  public sortClass(sort: string): string {
    return sort === this.selectedSort ? 'is-selected is-info' : '';
  }

  public teamClass(player: Player): string {
    const teamClasses = {
      'ARS': 'arsenal',
      'BOU': 'bournemouth',
      'BHA': 'brighton',
      'BUR': 'burnley',
      'CAR': 'cardiff',
      'CHE': 'chelsea',
      'CRY': 'palace',
      'EVE': 'everton',
      'FUL': 'fulham',
      'HUD': 'huddersfield',
      'LEI': 'leicester',
      'LIV': 'liverpool',
      'MCI': 'man-city',
      'MUN': 'man-utd',
      'NEW': 'newcastle',
      'SOU': 'southampton',
      'TOT': 'spurs',
      'WAT': 'watford',
      'WHU': 'west-ham',
      'WOL': 'wolves'
    };

    const code = this.teamCode(player);

    return teamClasses[code];
  }

  public teamCode(player: Player): string {
    return this.teams.find(t => t.id === player.teamId).code;
  }

  public positionClass(player: Player): string {
    const positionClasses = {
      'GKP': 'goalkeeper',
      'DEF': 'defender',
      'MID': 'midfielder',
      'FWD': 'forward'
    };

    return positionClasses[player.position];
  }

  public playerPrice(player: Player): string {
    return `£${player.currentPrice / 10}m`;
  }

  public applyFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  public applySort(sort: string): void {
    this.selectedSort = sort;
  }

  public ngOnInit() {
    this.subscriptions.push(this.dataService.data.subscribe(data => {
      this.players = data.players;
      this.teams = data.teams;
    }));
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
