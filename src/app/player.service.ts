import { Injectable } from '@angular/core';
import { Player } from './models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor() { }

  public processPlayers(players: Player[]): void {
    players.map(p => this.processPlayer(p));
  }

  private processPlayer(player: Player): void {
    player.averageMinutes = player.gamesPlayed > 0 ? player.minutes / player.gamesPlayed : 0;
    player.pointsPer90 = player.minutes < (20 * player.gamesPlayed) ? NaN : player.points * 90 / player.minutes;
    player.pointsPerMillion = player.points * 10 / player.currentPrice;
    player.value = !isNaN(player.pointsPer90) ? player.pointsPer90 * 10 / player.currentPrice : NaN;
  }
}
