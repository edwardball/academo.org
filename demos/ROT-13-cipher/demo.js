// (function(){

	//http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
	String.prototype.replaceAt=function(index, character) {
	    return this.substr(0, index) + character + this.substr(index+character.length);
	}

	var demo = new Demo({
		ui: {
			generate: {
			    title: "Encrypt/decrypt",
			    type: "button"
			}
		},

		init: function(){
			$("#demo").append("<textarea id='js-cipher'></textarea>");
			this.$cipher = $('#js-cipher');
	
	
			this.update();

			$('#js-cipher').val("Write your text to be encoded here, then click the \"Encrypt/Decrypt\" button.");
		},

		cipher: function(letter){
			// switch(letter) {
			// 	case("a")
			// 		console.log("yes")
			// 		break
			// }
		},

		update: function(e){
			text = this.$cipher.val();
			newText = [];

			for (i = 0 ; i < text.length ; i++){
				// console.log(text[i]);
				if (text[i].charCodeAt(0) >= 65 && text[i].charCodeAt(0) <= 90){
					newCharCode = 65 + ((text[i].charCodeAt(0) - 65 ) + 13) % 26 ;

					text = text.replaceAt(i, String.fromCharCode(newCharCode));
				} else if (text[i].charCodeAt(0) >= 97 && text[i].charCodeAt(0) <= 122){
					newCharCode = 97 + ((text[i].charCodeAt(0) - 97 ) + 13) % 26 ;
					text = text.replaceAt(i, String.fromCharCode(newCharCode));
				}

			}

			$('#js-cipher').val(text);

		},

		gaussian: function(x, mean, stdev){
			var exponent = -0.5 * Math.pow(x-mean,2) / Math.pow(stdev,2);
			return Math.exp(exponent)*(1/stdev) * (1/(Math.sqrt(2*Math.PI)));
		}
	});


// })();