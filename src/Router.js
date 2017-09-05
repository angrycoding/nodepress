var NFA;
var ROUTES = [];
var LAST_GID = 0;
var CACHE = {};

var AST_CHAR = 1;
var AST_RANGE = 2;
var AST_GROUP = 3;
var AST_CONCAT = 4;
var AST_REPEAT = 5;
var AST_ALTERNATE = 6;

function processChar(code, fromState, toState) {
	if (!NFA[fromState]) NFA[fromState] = [];
	NFA[fromState].push([toState, code]);
}

function processRange(operator, fromState, toState) {
	if (!NFA[fromState]) NFA[fromState] = [];
	NFA[fromState].push([toState, operator[1], operator[2]]);
}

function processConcatenation(operator, fromState, toState) {
	var iterator, prevState;
	var nextState = fromState;
	var length = operator.length;
	for (iterator = 1; iterator < length; iterator++) {
		prevState = nextState;
		if (iterator === length - 1) nextState = toState;
		else nextState = (++LAST_GID);
		processOperator(
			operator[iterator],
			prevState,
			nextState
		);
	}
}

function processAlternate(operator, fromState, toState) {
	var index = 0, length = operator.length;
	while (++index < length) processOperator(
		operator[index],
		fromState,
		toState
	);
}

function processRepetition(operator, fromState, toState) {

	var min = operator[1];
	var max = operator[2];
	var value = operator[3];

	var iterator, prevState;
	var nextState = fromState;
	if (!NFA[fromState]) NFA[fromState] = [];

	for (iterator = 0; iterator < min; iterator++) {
		prevState = nextState;
		if (iterator === max - 1) nextState = toState;
		else nextState = (++LAST_GID);
		processOperator(value, prevState, nextState);
	}

	for (iterator = min; iterator < max; iterator++) {
		prevState = nextState;
		if (iterator === max - 1) nextState = toState;
		else nextState = (++LAST_GID);
		processOperator(value, prevState, nextState);
		if (!NFA[prevState]) NFA[prevState] = [];
		NFA[prevState].push([toState]);
	}

	if (max === 0) {
		if (min === 0) {
			prevState = nextState;
			nextState = (++LAST_GID);
			processOperator(value, prevState, nextState);
			if (!NFA[prevState]) NFA[prevState] = [];
			NFA[prevState].push([toState]);
		}
		prevState = nextState;
		processOperator(value, prevState, prevState);
		if (!NFA[prevState]) NFA[prevState] = [];
		NFA[prevState].push([toState]);
	}
}

function processOperator(operator, fromState, toState) {
	var type = operator[0];
	switch (type) {
		case AST_CHAR: processChar(operator[1], fromState, toState); break;
		case AST_RANGE: processRange(operator, fromState, toState); break;
		case AST_CONCAT: processConcatenation(operator, fromState, toState); break;
		case AST_ALTERNATE: processAlternate(operator, fromState, toState); break;
		case AST_GROUP: processOperator(operator[1], fromState, toState); break;
		case AST_REPEAT: processRepetition(operator, fromState, toState); break;
		default: throw('unknown: ' + type);
	}
}

function clear() {
	NFA = [];
	CACHE = {};
	LAST_GID = 0;
	ROUTES = [];
}

function build() {
	NFA = [];
	CACHE = {};
	LAST_GID = 0;
	ROUTES.forEach((route, index) => processOperator(route.ast, 0, (-index - 1)));
}

function closure(input) {
	var range, shift;
	var output = input;
	var repeat, stateIndex;
	var ranges, rangeIndex;
	do {
		repeat = false;
		stateIndex = output.length;
		while (stateIndex--) {
			if (ranges = NFA[output[stateIndex]]) {
				rangeIndex = ranges.length;
				while (rangeIndex--) {
					range = ranges[rangeIndex];
					if (range.length === 1) {
						shift = range[0];
						if (output.indexOf(shift) === -1) {
							repeat = true;
							output.push(shift);
						}
					}
				}
			}
		}
	} while (repeat);
	return output;
}

function goto(input, code) {
	var ranges, rangeIndex, range, shift;
	var output = [], stateIndex = input.length;
	while (stateIndex--) {
		if (ranges = NFA[input[stateIndex]]) {
			rangeIndex = ranges.length;
			while (rangeIndex--) {
				range = ranges[rangeIndex];

				if (
					(range.length === 2 && code === range[1]) ||
					(range.length === 3 && code >= range[1] && code <= range[2])
				) {
					shift = range[0];
					if (output.indexOf(shift) === -1) {
						output.push(shift);
					}
				}


			}
		}
	}
	if (!output.length) return;
	return closure(output);
}

function get(input) {

	var acceptState = [];
	var startSet = closure([0]);

	for (var c = 0; c < input.length; c++) {
		var code = input.charCodeAt(c);
		startSet = goto(startSet, code);
		if (!startSet) break;
	}

	if (startSet) {
		for (var i = 0; i < startSet.length; i++) {
			if (!NFA[startSet[i]]) {
				acceptState.push(startSet[i]);
			}
		}
	}

	if (acceptState.length) {
		return acceptState.map(state => Math.abs(state) - 1);
	}
}

function add(path, data) {

	var re = /\$[a-z]+/g;
	var match;
	var frag;
	var startIndex = 0;
	var resultAST = [AST_CONCAT];
	var resultExp = '';
	var resultNames = [];
	var matchIndex;


	for (;;) if (match = re.exec(path)) {
		matchIndex = match.index;

		resultExp += (frag = path.slice(startIndex, matchIndex));
		Array.prototype.push.apply(resultAST, frag.split('').map(ch => [AST_CHAR, ch.charCodeAt(0)]));

		resultNames.push((match = match[0]).slice(1));
		resultExp += '([a-zA-Z0-9-]+)';
		resultAST.push([ AST_REPEAT, 1, 0, [ AST_ALTERNATE, [ AST_RANGE, 97, 122 ], [ AST_RANGE, 65, 90 ], [ AST_RANGE, 48, 57 ], [ AST_RANGE, 45, 45 ] ] ]);
		startIndex = matchIndex + match.length;
	} else {
		resultExp += (frag = path.slice(startIndex));
		Array.prototype.push.apply(resultAST, frag.split('').map(ch => [AST_CHAR, ch.charCodeAt(0)]));
		break;
	}

	matchIndex = path.indexOf('$');
	if (matchIndex === -1) matchIndex = Number.MAX_SAFE_INTEGER - path.length;


	ROUTES.push({
		ast: resultAST,
		exp: resultExp,
		names: resultNames,
		order: matchIndex,
		data: data
	});



}

function match(path) {

	if (CACHE.hasOwnProperty(path))
		return CACHE[path];

	var result = get(path);
	if (!result) return;
	result = result.sort((a, b) => ROUTES[b].order - ROUTES[a].order);
	result = ROUTES[result[0]];

	var params = {};
	var matches = new RegExp(result.exp).exec(path);
	for (var c = 1; c < matches.length; c++) {
		var pName = result.names[c - 1];

		if (params.hasOwnProperty(pName)) {
			if (!(params[pName] instanceof Array))
				params[pName] = [params[pName]];
			params[pName].push(matches[c]);
		}

		else params[pName] = matches[c];
	}

	return CACHE[path] = {params: params, data: result.data};
}

module.exports = {
	add: add,
	clear: clear,
	build: build,
	match: match
};