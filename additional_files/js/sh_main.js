syntax_highlight_cpp = [
	[
		[ /(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
		[ /\b(?:class|const_cast|delete|dynamic_cast|explicit|false|friend|inline|mutable|namespace|new|operator|private|protected|public|reinterpret_cast|static_cast|template|this|throw|true|try|typeid|typename|using|virtual)\b/g, "sh_keyword", -1],
		[ /\/\/\//g, "sh_comment", 1],
		[ /\/\//g, "sh_comment", 7],
		[ /\/\*/g, "sh_comment", 9],
		[ /(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
		[ /^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 10, 1],
		[ /^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
		[ /\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))[uU]?(?:[lL]|ll|LL)?\b/g, "sh_number", -1],
		[ /"/g, "sh_string", 13],
		[ /'/g, "sh_string", 14],
		[ /\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
		[ /\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
		[ /~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
		[ /\{|\}/g, "sh_cbracket", -1],
		[ /(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
		[ /([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)(<)(.*)(>)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_type", "sh_symbol", "sh_type", "sh_symbol", "sh_normal"], -1]
	], // 0
	[
		[ /$/g, null, -2],
		[ /(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
		[ /&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
		[ /@[A-Za-z]+/g, "sh_type", -1],
		[ /([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
		[ /"/g, "sh_string", 3]
	], // 1
	[], // 2
	[
		[ /\\(?:\\|")/g, null, -1],
		[ /"/g, "sh_string", -2]
	], // 3
	[
		[ />/g, "sh_preproc", -2],
		[ /([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
		[ /"/g,"sh_string", 3]
	], // 4
	[], // 5
	[
		[ /(?:\/)?>/g, "sh_keyword",-2],
		[ /([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
		[ /"/g,"sh_string", 3]
	], // 6
	[
		[ /$/g, null, -2]
	], // 7
	[
		[ /\*\//g, "sh_comment", -2],
		[ /&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
		[ /@[A-Za-z]+/g, "sh_type", -1],
	], // 8
	[
		[ /\*\//g, "sh_comment", -2],
	], // 9
	[
		[ /$/g, null, -2],
		[ /</g, "sh_string", 11],
		[ /"/g, "sh_string", 12],
		[ /\/\/\//g, "sh_comment", 1],
		[ /\/\//g, "sh_comment", 7],
		[ /\/\*\*/g, "sh_comment", 8],
		[ /\/\*/g, "sh_comment", 9]
	], // 10
	[
		[ /$/g, null, -2],
		[ />/g, "sh_string", -2]
	], // 11
	[
		[ /$/g, null, -2],
		[ /\\(?:\\|")/g, null, -1],
		[ /"/g, "sh_string", -2]
	], // 12
	[
		[ /"/g, "sh_string", -2],
		[ /\\./g, "sh_specialchar", -1]
	], // 13
	[
		[ /'/g, "sh_string", -2],
		[ /\\./g, "sh_specialchar", -1]
	] // 14
];

function sh_isEmailAddress(url) {
	if (/^mailto:/.test(url)) return false;
	return url.indexOf('@') !== -1;
}

function sh_setHref(tags, numTags, inputString) {
	var url = inputString.substring(tags[numTags - 2].pos, tags[numTags - 1].pos);
	if (url.length >= 2 && url.charAt(0) === '<' && url.charAt(url.length - 1) === '>') {
		url = url.substr(1, url.length - 2);
	}
	if (sh_isEmailAddress(url)) {
		url = 'mailto:' + url;
	}
	tags[numTags - 2].node.href = url;
}

/*
Konqueror has a bug where the regular expression /$/g will not match at the end
of a line more than once:

	var regex = /$/g;
	var match;

	var line = '1234567890';
	regex.lastIndex = 10;
	match = regex.exec(line);

	var line2 = 'abcde';
	regex.lastIndex = 5;
	match = regex.exec(line2);	// fails
*/
function sh_konquerorExec(s) {
	var result = [''];
	result.index = s.length;
	result.input = s;
	return result;
}

/**
Highlights all elements containing source code in a text string.  The return
value is an array of objects, each representing an HTML start or end tag.  Each
object has a property named pos, which is an integer representing the text
offset of the tag. Every start tag also has a property named node, which is the
DOM element started by the tag. End tags do not have this property.
@param  inputString	a text string
@param  language  a language definition object
@return	an array of tag objects
*/
function sh_highlightString(inputString, language) {
	if (/Konqueror/.test(navigator.userAgent)) {
		if (! language.konquered) {
			for (var s = 0; s < language.length; s++) {
				for (var p = 0; p < language[s].length; p++) {
					var r = language[s][p][0];
					if (r.source === '$') {
						r.exec = sh_konquerorExec;
					}
				}
			}
			language.konquered = true;
		}
	}

	var a = document.createElement('a');
	var span = document.createElement('span');

	// the result
	var tags = [];
	var numTags = 0;

	// each element is a pattern object from language
	var patternStack = [];

	// the current position within inputString
	var pos = 0;

	// the name of the current style, or null if there is no current style
	var currentStyle = null;

	var output = function(s, style) {
		var length = s.length;
		// this is more than just an optimization - we don't want to output empty <span></span> elements
		if (length === 0) {
			return;
		}
		if (! style) {
			var stackLength = patternStack.length;
			if (stackLength !== 0) {
				var pattern = patternStack[stackLength - 1];
				// check whether this is a state or an environment
				if (! pattern[3]) {
					// it's not a state - it's an environment; use the style for this environment
					style = pattern[1];
				}
			}
		}
		if (currentStyle !== style) {
			if (currentStyle) {
				tags[numTags++] = {pos: pos};
				if (currentStyle === 'sh_url') {
					sh_setHref(tags, numTags, inputString);
				}
			}
			if (style) {
				var clone;
				if (style === 'sh_url') {
					clone = a.cloneNode(false);
				}
				else {
					clone = span.cloneNode(false);
				}
				clone.className = style;
				tags[numTags++] = {node: clone, pos: pos};
			}
		}
		pos += length;
		currentStyle = style;
	};

	var endOfLinePattern = /\r\n|\r|\n/g;
	endOfLinePattern.lastIndex = 0;
	var inputStringLength = inputString.length;
	while (pos < inputStringLength) {
		var start = pos;
		var end;
		var startOfNextLine;
		var endOfLineMatch = endOfLinePattern.exec(inputString);
		if (endOfLineMatch === null) {
			end = inputStringLength;
			startOfNextLine = inputStringLength;
		}
		else {
			end = endOfLineMatch.index;
			startOfNextLine = endOfLinePattern.lastIndex;
		}

		var line = inputString.substring(start, end);

		var matchCache = [];
		for (;;) {
			var posWithinLine = pos - start;

			var stateIndex;
			var stackLength = patternStack.length;
			if (stackLength === 0) {
				stateIndex = 0;
			}
			else {
				// get the next state
				stateIndex = patternStack[stackLength - 1][2];
			}

			var state = language[stateIndex];
			var numPatterns = state.length;
			var mc = matchCache[stateIndex];
			if (! mc) {
				mc = matchCache[stateIndex] = [];
			}
			var bestMatch = null;
			var bestPatternIndex = -1;
			for (var i = 0; i < numPatterns; i++) {
				var match;
				if (i < mc.length && (mc[i] === null || posWithinLine <= mc[i].index)) {
					match = mc[i];
				}
				else {
					var regex = state[i][0];
					regex.lastIndex = posWithinLine;
					match = regex.exec(line);
					mc[i] = match;
				}
				if (match !== null && (bestMatch === null || match.index < bestMatch.index)) {
					bestMatch = match;
					bestPatternIndex = i;
					if (match.index === posWithinLine) {
						break;
					}
				}
			}

			if (bestMatch === null) {
				output(line.substring(posWithinLine), null);
				break;
			}
			else {
				// got a match
				if (bestMatch.index > posWithinLine) {
					output(line.substring(posWithinLine, bestMatch.index), null);
				}

				var pattern = state[bestPatternIndex];

				var newStyle = pattern[1];
				var matchedString;
				if (newStyle instanceof Array) {
					for (var subexpression = 0; subexpression < newStyle.length; subexpression++) {
						matchedString = bestMatch[subexpression + 1];
						output(matchedString, newStyle[subexpression]);
					}
				}
				else {
					matchedString = bestMatch[0];
					output(matchedString, newStyle);
				}

				switch (pattern[2]) {
				case -1:
					// do nothing
					break;
				case -2:
					// exit
					patternStack.pop();
					break;
				case -3:
					// exitall
					patternStack.length = 0;
					break;
				default:
					// this was the start of a delimited pattern or a state/environment
					patternStack.push(pattern);
					break;
				}
			}
		}

		// end of the line
		if (currentStyle) {
			tags[numTags++] = {pos: pos};
			if (currentStyle === 'sh_url') {
				sh_setHref(tags, numTags, inputString);
			}
			currentStyle = null;
		}
		pos = startOfNextLine;
	}

	return tags;
}

////////////////////////////////////////////////////////////////////////////////
// DOM-dependent functions

function sh_getClasses(element) {
	var result = [];
	var htmlClass = element.className;
	if (htmlClass && htmlClass.length > 0) {
		var htmlClasses = htmlClass.split(' ');
		for (var i = 0; i < htmlClasses.length; i++) {
			if (htmlClasses[i].length > 0) {
				result.push(htmlClasses[i]);
			}
		}
	}
	return result;
}

function sh_addClass(element, name) {
	var htmlClasses = sh_getClasses(element);
	for (var i = 0; i < htmlClasses.length; i++) {
		if (name.toLowerCase() === htmlClasses[i].toLowerCase()) {
			return;
		}
	}
	htmlClasses.push(name);
	element.className = htmlClasses.join(' ');
}

/**
Extracts the tags from an HTML DOM NodeList.
@param  nodeList  a DOM NodeList
@param  result  an object with text, tags and pos properties
*/
function sh_extractTagsFromNodeList(nodeList, result) {
	var length = nodeList.length;
	for (var i = 0; i < length; i++) {
		var node = nodeList.item(i);
		switch (node.nodeType) {
		case 1:
			if (node.nodeName.toLowerCase() === 'br') {
				var terminator;
				if (/MSIE/.test(navigator.userAgent)) {
					terminator = '\r';
				}
				else {
					terminator = '\n';
				}
				result.text.push(terminator);
				result.pos++;
			}
			else {
				result.tags.push({node: node.cloneNode(false), pos: result.pos});
				sh_extractTagsFromNodeList(node.childNodes, result);
				result.tags.push({pos: result.pos});
			}
			break;
		case 3:
		case 4:
			result.text.push(node.data);
			result.pos += node.length;
			break;
		}
	}
}

/**
Extracts the tags from the text of an HTML element. The extracted tags will be
returned as an array of tag objects. See sh_highlightString for the format of
the tag objects.
@param  element	a DOM element
@param  tags  an empty array; the extracted tag objects will be returned in it
@return  the text of the element
@see  sh_highlightString
*/
function sh_extractTags(element, tags) {
	var result = {};
	result.text = [];
	result.tags = tags;
	result.pos = 0;
	sh_extractTagsFromNodeList(element.childNodes, result);
	return result.text.join('');
}

/**
Merges the original tags from an element with the tags produced by highlighting.
@param	originalTags	an array containing the original tags
@param	highlightTags	an array containing the highlighting tags - these must not overlap
@result	an array containing the merged tags
*/
function sh_mergeTags(originalTags, highlightTags) {
	var numOriginalTags = originalTags.length;
	if (numOriginalTags === 0) {
		return highlightTags;
	}

	var numHighlightTags = highlightTags.length;
	if (numHighlightTags === 0) {
		return originalTags;
	}

	var result = [];
	var originalIndex = 0;
	var highlightIndex = 0;

	while (originalIndex < numOriginalTags && highlightIndex < numHighlightTags) {
		var originalTag = originalTags[originalIndex];
		var highlightTag = highlightTags[highlightIndex];

		if (originalTag.pos <= highlightTag.pos) {
			result.push(originalTag);
			originalIndex++;
		}
		else {
			result.push(highlightTag);
			if (highlightTags[highlightIndex + 1].pos <= originalTag.pos) {
				highlightIndex++;
				result.push(highlightTags[highlightIndex]);
				highlightIndex++;
			}
			else {
				// new end tag
				result.push({pos: originalTag.pos});

				// new start tag
				highlightTags[highlightIndex] = {node: highlightTag.node.cloneNode(false), pos: originalTag.pos};
			}
		}
	}

	while (originalIndex < numOriginalTags) {
		result.push(originalTags[originalIndex]);
		originalIndex++;
	}

	while (highlightIndex < numHighlightTags) {
		result.push(highlightTags[highlightIndex]);
		highlightIndex++;
	}

	return result;
}

/**
Inserts tags into text.
@param  tags  an array of tag objects
@param  text  a string representing the text
@return	a DOM DocumentFragment representing the resulting HTML
*/
function sh_insertTags(tags, text) {
	var doc = document;

	var result = document.createDocumentFragment();
	var tagIndex = 0;
	var numTags = tags.length;
	var textPos = 0;
	var textLength = text.length;
	var currentNode = result;

	// output one tag or text node every iteration
	while (textPos < textLength || tagIndex < numTags) {
		var tag;
		var tagPos;
		if (tagIndex < numTags) {
			tag = tags[tagIndex];
			tagPos = tag.pos;
		}
		else {
			tagPos = textLength;
		}

		if (tagPos <= textPos) {
			// output the tag
			if (tag.node) {
				// start tag
				var newNode = tag.node;
				currentNode.appendChild(newNode);
				currentNode = newNode;
			}
			else {
				// end tag
				currentNode = currentNode.parentNode;
			}
			tagIndex++;
		}
		else {
			// output text
			currentNode.appendChild(doc.createTextNode(text.substring(textPos, tagPos)));
			textPos = tagPos;
		}
	}

	return result;
}

/**
Highlights an element containing source code.  Upon completion of this function,
the element will have been placed in the "sh_sourceCode" class.
@param  element	a DOM <pre> element containing the source code to be highlighted
@param  language  a language definition object
*/
function sh_highlightElement(element, language) {
	var originalTags = [];
	var inputString = sh_extractTags(element, originalTags);
	var highlightTags = sh_highlightString(inputString, language);
	var tags = sh_mergeTags(originalTags, highlightTags);
	var documentFragment = sh_insertTags(tags, inputString);
	while (element.hasChildNodes()) {
		element.removeChild(element.firstChild);
	}
	element.appendChild(documentFragment);
}

function syntax_highlight() {
	var nodeList = document.getElementsByTagName('code');
	for (var i = 0; i < nodeList.length; i++) {
		var element = nodeList.item(i);
		var htmlClasses = sh_getClasses(element);
		for (var j = 0; j < htmlClasses.length; j++)
			if (htmlClasses[j].toLowerCase() === 'sh_cpp') {
				sh_highlightElement(element, syntax_highlight_cpp);
				break;
			}
	}
}
