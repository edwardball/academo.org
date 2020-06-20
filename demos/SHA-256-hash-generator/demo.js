var demo = new Demo({
	ui: {

	},

	init: function(){
		_this = this;

		$(".sha-generator").appendTo("#demo");

		_this.calculateHash($("#js-input").val());


		$("#js-input").keyup(function(){
			_this.calculateHash($(this).val());
		});  

	},

	update: function(e){

	},

	calculateHash: function(input){
		$("#js-output").val(CryptoJS.SHA256(input));
	}
});