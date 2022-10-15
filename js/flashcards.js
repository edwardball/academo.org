
	// initialization
	var slider = $('.slick-slider').slick({
		infinite:false,
	});
	/* Need to filter in case loading from Local Storage */
	$('.flashcards-carousel').slick('slickFilter',':not(.hide-flashcard)');

	/* Initialize checkboxes */
	
	for (var i = 0 ; i < flashcardData.length ; i++ ){
		if (flashcardData[i].status === "visible"){
			$(".flashcard-visibility-toggle[data-index='"+ flashcardData[i].id +"']").prop("checked", true);
		} else {
			$(".flashcard-visibility-toggle[data-index='"+ flashcardData[i].id +"']").prop("checked", false);
		}
	}

	/* Initialize face indicator */
	
	for (var i = 0 ; i < flashcardData.length ; i++ ){
		if (flashcardData[i].faceVisible === "front"){
			$(".face-indicator[data-index='"+ flashcardData[i].id +"']").addClass("face-indicator-up");
		} else {
			$(".face-indicator[data-index='"+ flashcardData[i].id +"']").removeClass("face-indicator-up")
		}
	}


	$(".js-total-slides").html(getTotalVisibleSlideCount());
	$(".js-current-slide").html("1");
	var currentSlideCache = 0;

		$('.flashcards-carousel').on('beforeChange', function(event, slick, currentSlide, nextSlide){
  		// console.log(nextSlide);
  		$(".js-current-slide").html(nextSlide+1)
		});


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
	$(".js-shuffle-2").click(function(){
		currentSlideCache = $(".flashcards-carousel").slick('slickCurrentSlide');
		$(".flashcards-carousel").slick('unslick');
		flashcardData = shuffle(flashcardData);
		updateHTML();
		$(".flashcards-carousel").slick({
			infinite:false,
			initialSlide: currentSlideCache
		});

		localStorage.setItem(pageName, JSON.stringify(flashcardData));

		$('.flashcards-carousel').slick('slickFilter',':not(.hide-flashcard)');
		$(".js-current-slide").html(currentSlideCache + 1);
	});

	$(".js-reset").click(function(){

		$(".flashcards-carousel").slick('unslick');
		flashcardData = initializeFlashcardData(true);
		updateHTML();
		$(".flashcards-carousel").slick({
			infinite:false,
			initialSlide: 0
		});
		$(".js-toggle-all-visibility").data("visible", 'visible');
		$(".flashcard-visibility-toggle").prop("checked", true).attr("checked", true);
		$(".js-current-slide").html("1");
		$(".js-total-slides").html(getTotalVisibleSlideCount());

	})

	$(".js-flip-all").click(function(){
		$(".flip-container").each(function(){
			if ($(this).hasClass("flip")){
				$(this).removeClass("flip");
			} else {
				$(this).addClass("flip");
			}
		});

		for (var i = 0 ; i < flashcardData.length ; i++ ){
			flashcardData[i].faceVisible = flashcardData[i].faceVisible == "front" ? "back" : "front";
		}
	});

	$(".flashcards-carousel").on("click", ".flip-container", function(){
		if ($(this).hasClass("flip")){
			$(this).removeClass("flip");
		} else {
			$(this).addClass("flip");
		}
	});

	$(".flashcard-visibility-toggle").change(function(){
		currentSlideCache = $(".flashcards-carousel").slick('slickCurrentSlide');
		$(".flashcards-carousel").slick('unslick');


		var index = $(this).data("index");

		for (var i = 0 ; i < flashcardData.length ; i++ ){
			if (flashcardData[i].id === index){
				flashcardData[i].status = flashcardData[i].status == "visible" ? "hidden" : "visible";
				break;
			}
		}

		// Save to local storage
		localStorage.setItem(pageName, JSON.stringify(flashcardData));


		updateHTML();

		$(".flashcards-carousel").slick({
			infinite:false,
			initialSlide: currentSlideCache
		});
		$(".js-current-slide").html(currentSlideCache + 1);
		$('.flashcards-carousel').slick('slickFilter',':not(.hide-flashcard)');
		$(".js-total-slides").html(getTotalVisibleSlideCount());
		
	})

	$(".face-indicator").click(function(){


		var id = $(this).data("index");

		for (var i = 0 ; i < flashcardData.length ; i++ ){
			if (flashcardData[i].id === id){
				flashcardData[i].faceVisible = flashcardData[i].faceVisible == "front" ? "back" : "front";
				break;
			}
		}

		if ($(".slide[data-flashcardid='"+id+"'] .flip-container").hasClass("flip")){
			$(".slide[data-flashcardid='"+id+"'] .flip-container").removeClass("flip")	
		} else {
			$(".slide[data-flashcardid='"+id+"'] .flip-container").addClass("flip")	
		}
		

		// Save to local storage
		localStorage.setItem(pageName, JSON.stringify(flashcardData));
		
	})

	$(".js-toggle-all-visibility").dblclick(function(e){
		currentSlideCache = $(".flashcards-carousel").slick('slickCurrentSlide');
		$(".flashcards-carousel").slick('unslick');

		e.preventDefault();

		if ($(this).data("visible") == "visible"){

			for (var i = 0 ; i < flashcardData.length ; i++){
				flashcardData[i].status = "hidden";
			}

			$(this).data("visible", "hidden");
			$(".flashcard-visibility-toggle").prop("checked", false).attr("checked", false);
			$(".js-current-slide").html("0");

		} else {
			for (var i = 0 ; i < flashcardData.length ; i++){
				flashcardData[i].status = "visible";
			}	
			$(".js-current-slide").html($(".flashcards-carousel").slick('slickCurrentSlide')+1);
			

			$(this).data("visible", "visible");		
			$(".flashcard-visibility-toggle").prop("checked", true).attr("checked", true);

		}

		// Save to local storage
		localStorage.setItem(pageName, JSON.stringify(flashcardData)); 

		updateHTML();

		$(".flashcards-carousel").slick({
			infinite:false,
			initialSlide: currentSlideCache
		});
		$('.flashcards-carousel').slick('slickFilter',':not(.hide-flashcard)');
		$(".js-total-slides").html(getTotalVisibleSlideCount());
	})


	function getTotalVisibleSlideCount(){
		var count = 0;
		for (var i = 0 ; i < flashcardData.length ; i++){
			if (flashcardData[i].status === "visible"){
				count++;
			}
		}
		return count;
	}

	document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '16'){
        // shift key, flip current slide
        var currentSlide = $(".flashcards-carousel").slick('slickCurrentSlide');

        if ($(".slide").eq(currentSlide).children(".flip-container").hasClass("flip")){
        	$(".slide").eq(currentSlide).children(".flip-container").removeClass("flip");
        } else {
        	$(".slide").eq(currentSlide).children(".flip-container").addClass("flip");
        }
        var currentID = $(".slide").eq(currentSlide).data("flashcardid");


        for (var i = 0 ; i < flashcardData.length ; i++ ){
			if (flashcardData[i].id === currentID){
				flashcardData[i].faceVisible = flashcardData[i].faceVisible == "front" ? "back" : "front";
				break;
			}
		}
        
    }
    

}

$(".js-go-to-start").click(function(e){
	$(".flashcards-carousel").slick("goTo", 0, false);
	$(".js-current-slide").html($(".flashcards-carousel").slick('slickCurrentSlide')+1);
	currentSlideCache = 0;
});

$(".js-go-to-end").click(function(e){
	$(".flashcards-carousel").slick("goTo", getTotalVisibleSlideCount()-1, false);
	$(".js-current-slide").html(getTotalVisibleSlideCount());
	currentSlideCache = getTotalVisibleSlideCount() - 1;
});


$(".face-indicator").click(function(e){
	if ($(this).hasClass("face-indicator-up")){
		$(this).removeClass("face-indicator-up");
	} else {
		$(this).addClass("face-indicator-up");
	}
});