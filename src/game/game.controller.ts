import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
	constructor(private gameService: GameService) {}
	
	@Get()
	createGame(){
		return 'Game created!';
	}

}
