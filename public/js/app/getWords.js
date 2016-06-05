'use strict'


var clean = function (iWords, word) {
	var idx = iWords.c2.indexOf(word);
	if ( idx !== -1 ) {
		iWords.c2.splice(idx,1); 
		iWords.score.splice(idx,1);
	}
	return (iWords);
}

var getWords = function (ngram) {
	
	var pW = ngram.previousWords,
			cW = ngram.currentWord,
			lenPW = pW.length,
			lenCW = cW.length;

	var token,tokenWords, iWords,sbScore, wordList = [];
	
	// loop on ngram freq tables (reverse) - JSON parse/stringify to deep copy the JSON
	for ( var i = lenPW; i>=0; i-- ) {
		
		// use previous words for ngrams > 1 
		if (lenPW>0 && i>0) {
			token = pW.slice(lenPW-i,lenPW).join(' ').toLowerCase();		
			tokenWords = freqJson[String(i+1)][token];
			if ( typeof(tokenWords) === 'undefined' ) continue; // skip if no match for the previous words
			iWords = JSON.parse(JSON.stringify(tokenWords));
		}
		// otherwise, i==0. We use the [az] freq table if a word is being typed
		else if ( lenCW>0 ) {
			if ( /[a-zA-Z]/.test(cW.substring(0,1)) ) {
				token = cW.substring(0,1).toLowerCase();
				tokenWords = freqJson["0"][token];
				if ( typeof(tokenWords) === 'undefined' ) continue; // skip if no match for the previous words
				iWords = JSON.parse(JSON.stringify(tokenWords));
			}
		}
		else {
			iWords = JSON.parse(JSON.stringify(freqJson["1"]));
		}
		
		// merge the two arrays into an array of arrays c2/score
		var iWordsArray=[]
		if (Array.isArray(iWords.c2)) {
			var lenIW=iWords.c2.length;
			for (var j = 0; j < lenIW; j++) {
				iWordsArray.push([iWords.c2[j], iWords.score[j]]);
			}
		}
		else {
			iWordsArray.push([iWords.c2, iWords.score]);
		}
		
		// additional filtering for beg of word
		if (lenCW>0) {
			iWordsArray = iWordsArray.filter(function(el) {
				return (el[0].substring(0,lenCW) === cW.toLowerCase());
			});
    }
		
		// keep only six elements ()
		iWordsArray = iWordsArray.slice(0,7);
		
		// remove last previous word from the suggested words
		if (lenPW>0) {
			var lastPW = pW.slice(-1)[0];
			iWordsArray = iWordsArray.filter(function(el) { return (el[0]!==lastPW); }); 
		}
		
		// update stupid backoff score 
		if (i < lenPW) {
			sbScore = Math.round((lenPW-i)*Math.log(0.4)*1000)/1000;
			iWordsArray = iWordsArray.map(function(el) { return [el[0],el[1] + sbScore]; });
		}
		
		// consolidate candidates
		iWordsArray.map(function(el) {
			if (typeof(wordList[el[0]])==='undefined' || wordList[el[0]] < el[1]) {
				wordList[el[0]]=el[1];
			}
		});
		
	}
	
	// sort candidates
	var sortable = [];
	for (var word in wordList) sortable.push([word, wordList[word]]);
	sortable.sort(function(a, b) {return b[1] - a[1]});
	var finalList = sortable.slice(0,3).map(function(el){return el[0];});

	// add current word in third place
	if (lenCW>0 && finalList.indexOf(cW) === -1) {
		finalList.pop();
		finalList.push(cW);
	}
	
	return finalList;
	
}

