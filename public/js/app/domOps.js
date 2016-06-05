'use strict'

var freqJson,ngram;

$(document).ready(function() {
  $("#inputText").focus();
	$.getJSON("./data/en_US.10.freq.10.fast.json", function(json) {
    freqJson = json;
		updateButtons();
		$("#inputText").prop('disabled', false);
		$("#inputText").prop('placeholder', 'start typing');
		$("#inputText").focus();
	});	
});

// update input on button click
$(document).on("click", "#word1", function(evt) {	updateInput(evt); });
$(document).on("click", "#word2", function(evt) {	updateInput(evt); });
$(document).on("click", "#word3", function(evt) { updateInput(evt); });

// update buttons on input click/keyup
$(document).on("keyup", ".reactiveTextarea", function(evt) {
	updateButtons();
	// auto redim the textarea when text becomes too large
	var el = $(evt.target)[0];
	var offset = el.offsetHeight - el.clientHeight;
	$(el).css('height', 'auto').css('height', el.scrollHeight + offset);
});
$(document).click(".reactiveTextarea", function(evt) { updateButtons(); });

// update functions
function updateButtons () {
	ngram = getNgram("inputText");
	var nWords = getWords(ngram);
	$("#word1").html(nWords[2] || " ");
	$("#word2").html(nWords[0] || " ");
	$("#word3").html(nWords[1] || " ");
}

function updateInput (evt) {
	
	var newWord = $(evt.target)[0].innerText,
			newCursorPos = ngram.cursorPos;
			
	if (ngram.nextText.substring(0,1) !== ' ') {
		newWord = newWord + ' ';
	}
	else {
		newCursorPos = newCursorPos + 1;
	}
	
	newCursorPos = newCursorPos + newWord.length;
	var newInput = ngram.previousText + newWord + ngram.nextText;
	
	$("#inputText").val(newInput);
	$("#inputText")[0].selectionStart = newCursorPos;
	$("#inputText")[0].selectionEnd = newCursorPos;
	$("#inputText").focus();
	
}

