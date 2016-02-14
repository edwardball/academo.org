(function(){

	var demo = new Demo({
		ui: {
			calculate: {
				title: "calculate",
				type: "button"
			}
		},

		init: function(){
			// $("#demo").append("<label>Please enter your numbers, separated by commas</label><br /><textarea></textarea>");
			$("#results").appendTo("#demo");
		},

		update: function(e){
			var numbers = $("#demo textarea").val().split(","),
			// console.log(numbers);
			// sum = 0;
			sum = new Decimal(0);
			for (i = 0 ; i < numbers.length ; i++){
				sum = sum.plus(parseFloat(numbers[i]));
			}
			var mean = sum.dividedBy(numbers.length);
			$("#number-of-numbers").val(numbers.length);
			$("#mean").val(mean);
			
			weightedSum = new Decimal(0);
			for (i = 0 ; i < numbers.length ; i++){
				var number = new Decimal(numbers[i]);
				var difference = number.minus(mean);

				// weightedSum = Math.pow(parseFloat(numbers[i]) - mean, 2);
				weightedSum = weightedSum.plus(difference.toPower(2));
			}

			variance = (weightedSum.dividedBy(numbers.length));

			$("#variance").val(variance);

			// stdev = Math.sqrt(weightedSum / numbers.length);
			stdev = variance.squareRoot();

			$("#stdev").val(stdev);
		}
	});

})();

