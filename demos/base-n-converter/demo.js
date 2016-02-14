var ui = null;

var data = [
"binary",
"ternary",
"quaternary",
"quinary",
"senary",
"septenary",
"octal",
"nonary",
"decimal",
"undecimal",
"duodecimal",
"tridecimal",
"tetradecimal",
"pentadecimal",
"hexadecimal"];

// var allowableChars = "0123456789ABCDEFabcdef";

$("#demo").append("<table></table>");

var number = 25;

for (i = 2 ;  i <= 16 ;i++){
	$("#demo table").append("<tr><td class='label'><label for='"+data[i-2]+"'>"+data[i-2]+" (base " +i + ")</label></td><td><input type='text' id='"+data[i-2]+"' value='"+number.toString(i)+"'/></td></tr>")
}


//http://www.jasondahlin.com/2011/coding-tips/javascript-input-limiter.asp
function inputLimiter(e,allow) {
    var AllowableCharacters = '0123456789ABCDEFabcdef';
    var AllowableCharacters = 'abc';

    // if (allow == 'Letters'){AllowableCharacters=' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';}
    // if (allow == 'Numbers'){AllowableCharacters='1234567890';}
    // if (allow == 'NameCharacters'){AllowableCharacters=' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-.\'';}
    // if (allow == 'NameCharactersAndNumbers'){AllowableCharacters='1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-\'';}

    var k = document.all?parseInt(e.keyCode): parseInt(e.which);
    if (k!=13 && k!=8 && k!=0){
        if ((e.ctrlKey==false) && (e.altKey==false)) {
        return (AllowableCharacters.indexOf(String.fromCharCode(k))!=-1);
        } else {
        return true;
        }
    } else {
        return true;
    }
}

$("input").on("input", function(e){
	base = $(this).parents("tr").index() + 2;
	number = $(this).val() ? parseInt($(this).val(), base) : 0;
	$("input").each(function(i){
		$(this).val(number.toString(i+2));
	});
	// e.preventDefault();
	// $(this).val(inputLimiter(e));

	// console.log(e);
})