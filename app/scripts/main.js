angular.module('plan', []).
	config(function($routeProvider){
		$routeProvider
			.when('/',{
				controller:mainCtrl,
				template:$('#main').html()
			})
	}).
	directive('tooltip', function(){
		return {
			restrict: 'AC',
			link: function(scope, element, attr){
				$(element).tooltip({
					placement:'auto'
				});
			}
		}
	})
;

function mainCtrl($scope){
	$scope.region = [];
	$scope.group_size = 3;
	$scope.selected = [];
	$scope.all_seats = [];
	
	$scope.init = function(){
		var rows = ['A', 'B', 'C', 'D', 'E', 'F'];
		var num_col = 12;

		$scope.main = {
			id:1,
			name:'Main Region',
			rows: []
		};

		var id = 1;
		$.each(rows, function(){
			var letter = this;
			$scope.addRow($scope.main, {
				name: letter,
				seats: []
			});
			var this_row = $scope.main.rows[$scope.main.rows.length-1];
			for(var i = 1; i < num_col+1; i++){
				var seat = {
					available:'available',
					name:letter+''+i,
					pos:i,
					row:letter,
					id:id,
					row_ref:this_row
				};
				$scope.addSeat(this_row, seat);
				$scope.all_seats.push(seat);
				id++;
			}
		});
		for(var i=1;i<15;i++){
			$scope.randomSeatingUnavailable();
		}
	}

	$scope.addRegion = function(r){
		var region = r || {id:Math.random().toString(36).substring(7), name: 'Example Region', rows: []};
		$scope.region.push(region);
	}

	$scope.addRow = function(region, r){
		var row = r || {name:'ROW', seats:[]}
		region.rows.push(row);
	}

	$scope.addSeat = function(row, s){
		var seat = s || {available:'available', name: 'ROWTEST'};
		row.seats.push(seat);
		// row[seat.name] = {available:seat.available, id:seat.name};
	}

	$scope.closestAvailableSeat = function(seat){
		var row = seat.row_ref;
		var this_index = row.seats.indexOf(seat);
		if(seat.available){
			//check next seat
			var next_seat = row.seats[this_index+1];
			if(next_seat && next_seat.available == 'available'){
				return next_seat;
			}else{
				var prev_seat = row.seats[this_index-1];
				if(prev_seat && prev_seat.available == 'available'){
					return prev_seat;
				}
			}
			return false;
		}
		return false;
	}

	$scope.selectSeat = function(seat){

		// for(var i=0;i<$scope.group_size;i++){
		// 	var closest = $scope.closestAvailableSeat(seat);
		// 	if(closest){
		// 		closest.available = 'selected';
		// 		$scope.selected.push(closest);
		// 	}
		// }

		$scope.remaining = $scope.group_size - $scope.selected.length;
		if(seat.available=='available' && $scope.remaining > 0){
			seat.available = 'selected';
			$scope.selected.push(seat);
		}else if(seat.available=='selected'){
			seat.available = 'available';
			$scope.selected.pop(seat);
		}else if($scope.remaining == 0){
			//can't do anything, ran out of group size
			$scope.selected[0].available='available';
			$scope.selected.splice(0,1);
			seat.available = 'selected';
			$scope.selected.push(seat);
		}
		$scope.remaining = $scope.group_size - $scope.selected.length;
	}

	$scope.randomSeatingUnavailable = function(){
		var random = Math.floor((Math.random()*72)+1);
		$.each($scope.all_seats, function(){
			if(this.id==random) {
				this.available='unavailable';
			}
		});
	}

	$scope.init();
}