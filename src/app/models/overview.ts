import { Gameweek } from './gameweek';
import { Player } from './player';
import { Team } from './team';

export interface Overview {
  nextGameweek: number;
  gameweeks: Gameweek[];
  players: Player[];
  teams: Team[];
}
