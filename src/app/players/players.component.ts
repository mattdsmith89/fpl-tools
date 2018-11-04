import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { Player } from '../models/player';
import { Team } from '../models/team';

@Component({
  selector: 'fpl-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private teams: Team[] = [];
  private selectedFilter = 'ALL';
  private selectedSorts = ['POINTS'];

  public isNaN = Number.isNaN;

  public players: Player[] = [];
  public get filteredPlayers(): Player[] {
    let players: Player[];
    if (this.selectedFilter === 'ALL') {
      players = this.players;
    } else {
      players = this.players.filter(p => p.position === this.selectedFilter);
    }

    if (this.maxPrice && this.maxPrice > 0) {
      players = players.filter(p => p.currentPrice <= this.maxPrice * 10);
    }

    return this.sortPlayers(players);
  }

  public maxPrice: number;

  constructor(private dataService: DataService) { }

  private sortPlayers(players: Player[]): Player[] {
    let sortedPlayers = players;

    this.selectedSorts.forEach(sort => {
      switch (sort) {
        case 'POINTS':
          sortedPlayers = this.sortByPoints(sortedPlayers);
          break;
        case 'PRICE':
          sortedPlayers = this.sortByPrice(sortedPlayers);
          break;
        case 'MINS':
          sortedPlayers = this.sortByMins(sortedPlayers);
          break;
        case 'PP90':
          sortedPlayers = this.sortByPP90(sortedPlayers);
          break;
        case 'PP£':
          sortedPlayers = this.sortByPPMil(sortedPlayers);
          break;
      }
    });

    return sortedPlayers;
  }

  private sortByPoints(players: Player[]): Player[] {
    return players.sort((p1, p2) => p2.points - p1.points);
  }

  private sortByMins(players: Player[]): Player[] {
    return players.sort((p1, p2) => p2.averageMinutes - p1.averageMinutes);
  }

  private sortByPP90(players: Player[]): Player[] {
    return players.sort((p1, p2) => p2.pointsPer90 - p1.pointsPer90);
  }

  private sortByPPMil(players: Player[]): Player[] {
    return players.sort((p1, p2) => p2.pointsPerMillion - p1.pointsPerMillion);
  }

  private sortByPrice(players: Player[]): Player[] {
    return players.sort((p1, p2) => p2.currentPrice - p1.currentPrice);
  }

  public filterClass(filter: string): string {
    return filter === this.selectedFilter ? 'is-selected is-info' : '';
  }

  public sortClass(sort: string): string {
    return this.selectedSorts.includes(sort) ? 'is-selected is-info' : '';
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

  public pointsHeat(player: Player): string {
    const lastIndex = this.players.length - 1;
    const maxPoints = this.sortByPoints(this.players)[0].points;
    const minPoints = this.sortByPoints(this.players)[lastIndex].points;

    return this.heatClass(player.points, minPoints, maxPoints);
  }

  public minutesHeat(player: Player): string {
    const lastIndex = this.players.length - 1;
    const maxMins = this.sortByMins(this.players)[0].averageMinutes;
    const minMins = this.sortByMins(this.players)[lastIndex].averageMinutes;

    return this.heatClass(player.averageMinutes, minMins, maxMins);
  }

  public pp90Heat(player: Player): string {
    const lastIndex = this.players.filter(p => p.minutes > 90).length - 1;
    const maxPP90 = this.sortByPP90(this.players.filter(p => p.minutes > 90))[0].pointsPer90;
    const minPP90 = this.sortByPP90(this.players.filter(p => p.minutes > 90))[lastIndex].pointsPer90;

    return this.heatClass(player.pointsPer90, minPP90, maxPP90);
  }

  public ppMilHeat(player: Player): string {
    const lastIndex = this.players.length - 1;
    const maxPPmil = this.sortByPPMil(this.players)[0].pointsPerMillion;
    const minPPmil = this.sortByPPMil(this.players)[lastIndex].pointsPerMillion;

    return this.heatClass(player.pointsPerMillion, minPPmil, maxPPmil);
  }

  public priceHeat(player: Player): string {
    const lastIndex = this.players.filter(p => p.position === player.position).length - 1;
    const maxPrice = this.sortByPrice(this.players.filter(p => p.position === player.position))[0].currentPrice;
    const minPrice = this.sortByPrice(this.players.filter(p => p.position === player.position))[lastIndex].currentPrice;

    return this.heatClass(player.currentPrice, minPrice, maxPrice);
  }

  private heatClass(value: number, min: number, max: number): string {
    const range = max - min;
    if (value < min + (range / 6) || isNaN(value)) {
      return 'is-ice';
    } else if (value < min + (range * 2 / 6)) {
      return 'is-colder';
    } else if (value < min + (range * 3 / 6)) {
      return 'is-cold';
    } else if (value < min + (range * 4 / 6)) {
      return 'is-warm';
    } else if (value < min + (range * 5 / 6)) {
      return 'is-warmer';
    } else {
      return 'is-hot';
    }
  }

  public applyFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  public toggleSort(sort: string): void {
    if (this.selectedSorts.includes(sort)) {
      this.selectedSorts = this.selectedSorts.filter(s => s !== sort);
    } else {
      const temp = this.selectedSorts.reverse();
      temp.push(sort);
      this.selectedSorts = temp.reverse();
    }
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
