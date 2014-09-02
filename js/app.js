var firebaseLink = "https://trextoe.firebaseio.com/data";
var app = angular.module("trextoe", ["firebase"]);
app.controller("trextoeCtrl", ["$scope", "$firebase", function($scope, $firebase){
	
	// controls what's 
	$scope.submitname = true;
	$scope.gameboard = false;
	$scope.showNameScore = false;
	$scope.showWhosTurn = false;


	$scope.playerNumber;

	$scope.startup = function(){
		// startup database
		var ref = new Firebase(firebaseLink);
		var sync = $firebase(ref);
		syncObject = sync.$asObject();
		syncObject.$bindTo($scope, "db").then(function(){
	
			// SESSIONS AN STUFF
			// if($scope.db==undefined)
			// {
			// 	$scope.db=[];
			// } 
			if($scope.db.player===2)
			{
				$scope.playerNumber = $scope.db.player;
				// reset player values
				$scope.db.player = 1; 
				// set player name in db
				$scope.db.pTwoname = $scope.playerName;
				// player counter to proceed from wait
				$scope.db.totalPlayers = 2;
				$scope.db.turn = 1;
				$scope.db.scoreboard = [0,0]
				
			}
			else
			{

				$scope.db.player = 1;
				$scope.playerNumber = $scope.db.player;
				// set value for next player
				$scope.db.player += 1;

				// set player name in db
				$scope.db.pOnename = $scope.playerName;
				// player counter to proceed from wait
				$scope.db.totalPlayers = 1;
			}
			// $scope.totalPlayers +=1;
			$scope.playerName; 
			// hide submitname div
			$scope.submitname = false;
			$scope.waiting();
		});
	};

	$scope.waiting = function(){
		// show waiting screen
		$scope.show_waiting = true;
		$scope.$watch('db.totalPlayers', function(newVal,oldVal) {
      
			if (newVal==2)
			{
				$scope.show_waiting = false;
				$scope.makeBoard();
				
			}		
		});
	};

	$scope.makeBoard = function(){
		// show who starts
		$scope.showWhosTurn = true;
		$scope.db.whosup = $scope.db.turn==1 ? $scope.db.pOnename: $scope.db.pTwoname; 

		$scope.showNameScore = true;
		// show board
		$scope.gameboard = true;
		// reset result statement
		$scope.db.result = "";
		$scope.win = "";
		$scope.db.tie = false;
		// set end game to hide results
		$scope.db.end_game = false;
		// setup board
		$scope.db.board = [{"player": "","win": ""},{"player": "","win": ""},{"player": "","win": ""},{"player": "","win": ""},{"player": "","win": ""},{"player": "","win": ""},{"player": "","win": ""},{"player": "","win": ""},{"player": "","win": ""}];		
	};

	$scope.placePiece = function(index){


		// check if empty or game is ended
		if(validMove(index)  && !$scope.db.end_game)
		{
			$scope.showWhosTurn=false;
			// this sets position with player's number

			$scope.db.board[index].player = $scope.playerNumber;
			// change value to denote next players turn
			if (checkWinner(index))
			{
				$scope.db.winner;
				$scope.db.end_game = true;
				// set winner name and add to score board 
				$scope.db.turn == 1? ($scope.db.winner = $scope.db.pOnename, $scope.db.scoreboard[0]+=1):($scope.db.winner = $scope.db.pTwoname, $scope.db.scoreboard[1]+=1);
				$scope.db.turn == $scope.playerNumber ? $scope.win = true: $scope.win = false;
			}
			else if (checkTie())
			{
				$scope.db.tie = true;
				$scope.db.result = "It's a tie.";
				$scope.db.end_game = true;

			}
			else
			{
				changeTurn();
			}
		}
	};
	function changeTurn(){
		$scope.showWhosTurn = true;
		$scope.db.turn == 1 ? $scope.db.turn = 2 : $scope.db.turn = 1;
		$scope.db.turn == 1 ? $scope.db.whosup = $scope.db.pOnename : $scope.db.whosup = $scope.db.pTwoname;
	};

	function validMove(index){
		return ($scope.db.board[index].player=="" && $scope.playerNumber==$scope.db.turn);
	};

	// returns true for winner otherwise default false
	function checkWinner(index){
		var result = false;
		switch (index){
			case 0:
				result = winZero(index);
				break;
			case 1:
				result = winOne(index);
				break;
			case 2:
				result = winTwo(index);
				break;
			case 3:
				result = winThree(index);
				break;
			case 4:
				result = winFour(index);
				break;
			case 5:
				result = winFive(index);
				break;
			case 6:
				result = winSix(index);
				break;
			case 7:
				result = winSeven(index);
				break;
			case 8:
				result = winEight(index);
				break
		}
		return result;
	};
	// check conditions that return true when win condition present
	function winZero(index){
		var player = $scope.db.board[index].player; 
		var c1 = player == $scope.db.board[1].player && player == $scope.db.board[2].player;
		var c2 = player == $scope.db.board[3].player && player == $scope.db.board[6].player;
		var c3 = player == $scope.db.board[4].player && player == $scope.db.board[8].player;

		var result = c1 || c2 || c3;
		if(c1)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[1].win = player;
			$scope.db.board[2].win = player;
		}
		else if (c2)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[3].win = player;
			$scope.db.board[6].win = player;
		}
		else if (c3)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[4].win = player;
			$scope.db.board[8].win = player;
		}
		return result;		
	};
	function winOne(index){
		var player = $scope.db.board[index].player;
		var c1 = player == $scope.db.board[0].player && player == $scope.db.board[2].player;		
		var c2 = player == $scope.db.board[4].player && player == $scope.db.board[7].player;
		var result = c1 || c2;

		if(c1)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[0].win = player;
			$scope.db.board[2].win = player;
		}
		else if (c2)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[4].win = player;
			$scope.db.board[7].win = player;
		}
		return result;		 
	};
	function winTwo(index){
		var player = $scope.db.board[index].player;
		var c1 = player == $scope.db.board[1].player && player == $scope.db.board[0].player;
		var c2 = player == $scope.db.board[4].player && player == $scope.db.board[6].player;
		var c3 = player == $scope.db.board[5].player && player == $scope.db.board[8].player;

		var result = c1 || c2 || c3;

		if(c1)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[1].win = player;
			$scope.db.board[0].win = player;
		}
		else if (c2)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[4].win = player;
			$scope.db.board[6].win = player;
		}
		else if (c3)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[5].win = player;
			$scope.db.board[8].win = player;
		}

		return result;		
	};
	function winThree(index){
		var player = $scope.db.board[index].player;
		var c1 = player == $scope.db.board[0].player && player == $scope.db.board[6].player;	
		var c2 = player == $scope.db.board[4].player && player == $scope.db.board[5].player;
		var result = c1 || c2;
		if(c1)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[0].win = player;
			$scope.db.board[6].win = player;
		}
		else if (c2)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[4].win = player;
			$scope.db.board[5].win = player;
		}
		
		return result;	
	};
	function winFour(index){
		var player = $scope.db.board[index].player;
		var c1 = player == $scope.db.board[0].player && player == $scope.db.board[8].player;
		var c2 = player == $scope.db.board[2].player && player == $scope.db.board[6].player;
		var c3 = player == $scope.db.board[3].player && player == $scope.db.board[5].player;
		var c4 = player == $scope.db.board[1].player && player == $scope.db.board[7].player; 
		var result = c1 || c2 || c3 || c4;
		if(c1)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[0].win = player;
			$scope.db.board[8].win = player;
		}
		else if (c2)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[2].win = player;
			$scope.db.board[6].win = player;
		}
		else if (c3)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[3].win = player;
			$scope.db.board[5].win = player;
		}
		else if (c4)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[1].win = player;
			$scope.db.board[7].win = player;
		}
		return result;	
	};
	function winFive(index){
		var player = $scope.db.board[index].player;
		var c1 = player == $scope.db.board[2].player && player == $scope.db.board[8].player;
		
		var c2 = player == $scope.db.board[3].player && player == $scope.db.board[4].player;

		var result = c1 || c2 ;

		if(c1)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[2].win = player;
			$scope.db.board[8].win = player;
		}
		else if (c2)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[3].win = player;
			$scope.db.board[4].win = player;
		}
		
		return result;	
	};
	function winSix(index){
		var player = $scope.db.board[index].player;
		var c1 = player == $scope.db.board[0].player && player == $scope.db.board[3].player;
		var c2 = player == $scope.db.board[4].player && player == $scope.db.board[2].player;
		var c3 = player == $scope.db.board[7].player && player == $scope.db.board[8].player;

		var result = c1 || c2 || c3;

		if(c1)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[0].win = player;
			$scope.db.board[3].win = player;
		}
		else if (c2)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[4].win = player;
			$scope.db.board[2].win = player;
		}
		else if (c3)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[7].win = player;
			$scope.db.board[8].win = player;
		}
		return result;		
	};
	function winSeven(index){
		var player = $scope.db.board[index].player;
		var c1 = player == $scope.db.board[1].player && player == $scope.db.board[4].player;
		var c2 = player == $scope.db.board[6].player && player == $scope.db.board[8].player;
		var result = c1 || c2;

		if(c1)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[1].win = player;
			$scope.db.board[4].win = player;
		}
		else if (c2)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[6].win = player;
			$scope.db.board[8].win = player;
		}
		
		return result;	
	};
	function winEight(index){
		var player = $scope.db.board[index].player;
		var c1 = player == $scope.db.board[5].player && player == $scope.db.board[2].player;
		
		var c2 = player == $scope.db.board[7].player && player == $scope.db.board[6].player;

		var c3 = player == $scope.db.board[4].player && player == $scope.db.board[0].player;

		var result = c1 || c2 || c3;

		if(c1)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[5].win = player;
			$scope.db.board[2].win = player;
		}
		else if (c2)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[7].win = player;
			$scope.db.board[6].win = player;
		}
		else if (c3)
		{
			$scope.db.board[index].win = player;
			$scope.db.board[4].win = player;
			$scope.db.board[0].win = player;
		}
		return result;	
	};

	// returns true for tie game
	function checkTie(index){
		var isTie = false;
		for(i = 0; i<$scope.db.board.length; i++)
		{
			if($scope.db.board[i].player=="")
			{
				isTie = false;
				return isTie;
			}
			else
			{
				isTie = true;
			}
		}
		return isTie;
	};

	// reset game
	$scope.reset = function(){
		// just to make it fair
		$scope.db.turn == 1? $scope.db.turn = 2: $scope.db.turn = 1;
		$scope.makeBoard();
	};


	// GAME IN PROGRESS
	$scope.game_in_progress = function(){

	};

}]);