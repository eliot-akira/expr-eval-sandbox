var Parser = window.exprEval.Parser
var root = document.querySelector('#expreval')
var textareaEl = root.querySelector('.expreval-textarea')
var runActionEl = root.querySelector('.expreval-action-run')
var tokensEl = root.querySelector('.expreval-tokens code')
var parsedEl = root.querySelector('.expreval-parsed code')
var resultEl = root.querySelector('.expreval-result code')

// See https://github.com/silentmatt/expr-eval

var parser = new Parser({
  operators: {
    // These default to true, but are included to be explicit
    add: true,
    concatenate: true,
    conditional: true,
    divide: true,
    factorial: true,
    multiply: true,
    power: true,
    remainder: true,
    subtract: true,

    // Disable and, or, not, <, ==, !=, etc.
    logical: false,
    comparison: false,

    // The in and = operators are disabled by default in the current version
    'in': true,
    assignment: true
  }
})

var scope = {}

textareaEl.focus()

runActionEl.addEventListener('click', function() {
  textareaEl.focus()
  let parsed
  try {
    parsed = parser.parse(textareaEl.value, scope)
    tokensEl.innerText = JSON.stringify(parsed.tokens, null, 2)
    parsedEl.innerText = parsed.toString()
    try {
      resultEl.innerText = parsed.evaluate(scope)
    } catch(e) {
      resultEl.innerText = 'Error: '+e.message
    }
  } catch(e) {
    tokensEl.innerText = ''
    parsedEl.innerText = 'Error: '+e.message
    resultEl.innerText = ''
  }
})
