'use strict'

var getNgram = function (textareaID, cursorInit) {
	
	textareaID = '#' + textareaID;
	var input = $(textareaID), // or $('#myinput')[0]
		cursorPos = input[0].selectionStart,
		inputText = input.val();
		
	// detect if selection
	if (input.selectionStart !== input.selectionEnd) {
		var selectionValue =
		input.value.substring(input.selectionStart, input.selectionEnd);
	}

	var beforePos = inputText.substring(0,cursorPos),
			afterPos = inputText.substring(cursorPos,inputText.length),
			lastChar = beforePos.slice(-1),
			pat = /^[a-zA-Z0-9\']+/;
	
	// check if cursor in a middle of a word; include full word if yes
	if (lastChar.match(pat) !== null && afterPos.match(pat) !== null) {
		var len = afterPos.match(pat)[0].length;
		cursorPos = cursorPos + len;
		beforePos = inputText.substring(0,cursorPos);
		afterPos = inputText.substring(cursorPos,inputText.length);
	}
	
	// take the last three words + current word
	var pat2 = /^(.*[^a-zA-Z0-9\' ])*([\n])*([a-zA-Z0-9\' ]*)/,
			currentWords = (".\n" + beforePos).match(pat2)[3].split(' ').slice(-4),
			previousWords = currentWords.slice(0,currentWords.length-1),
			currentWord = currentWords.slice(-1)[0];
	
	if (previousWords.length!==0) {
		var ncharPW = 0;
		for (var i=0;i<previousWords.length;i++) {
			ncharPW = ncharPW + previousWords[i].length;
		}
	}
	
	var ngram = {
		//"previousWords": (previousWords.length===0 || previousWords.reduce((a,b) => a+b.length) === 0) ? ["eol#"] : previousWords,
		"previousWords": (previousWords.length===0 || ncharPW === 0) ? ["eol#"] : previousWords,
		"currentWord": currentWord,
		"previousText": beforePos.substring(0,beforePos.length-currentWord.length),
		"nextText": afterPos,
		"cursorPos": cursorPos-currentWord.length
	}
	
	return(ngram)
	
}
