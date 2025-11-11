// parser.js
// Core engine - Parser module

/**
 * Parses a string into a structured object based on predefined grammar.
 *
 * @param {string} inputString - The string to parse.
 * @param {object} grammar - An object defining the grammar rules.
 * @returns {object|null} - The parsed object, or null if parsing fails.
 */
function parse(inputString, grammar) {
  if (!inputString || typeof inputString !== 'string') {
    console.error("Invalid input: Input must be a non-empty string.");
    return null;
  }

  if (!grammar || typeof grammar !== 'object') {
    console.error("Invalid grammar: Grammar must be a valid object.");
    return null;
  }

  try {
    return parseInternal(inputString, grammar);
  } catch (error) {
    console.error("Parsing error:", error.message);
    return null;
  }
}

/**
 * Internal recursive parsing function.
 *
 * @param {string} input - The remaining input string to parse.
 * @param {object} rule - The current grammar rule to apply.
 * @returns {object} - The parsed object.
 * @throws {Error} - If parsing fails.
 */
function parseInternal(input, rule) {
  if (typeof rule === 'string') {
    // Terminal case: Match the string exactly.
    if (input.startsWith(rule)) {
      return { value: rule, remainingInput: input.slice(rule.length) };
    } else {
      throw new Error(`Expected "${rule}" but found "${input.slice(0, Math.min(rule.length, input.length))}"`);
    }
  } else if (Array.isArray(rule)) {
    // Sequence case: Match each rule in the array in order.
    let result = { value: [], remainingInput: input };
    for (const subRule of rule) {
      const subResult = parseInternal(result.remainingInput, subRule);
      result.value.push(subResult.value);
      result.remainingInput = subResult.remainingInput;
    }
    return result;
  } else if (typeof rule === 'object') {
    // Object case: Match one of the properties in the object.
    for (const key in rule) {
      if (rule.hasOwnProperty(key)) {
        try {
          const subResult = parseInternal(input, rule[key]);
          return { value: { [key]: subResult.value }, remainingInput: subResult.remainingInput };
        } catch (e) {
          // Ignore error and try the next rule
        }
      }
    }
    throw new Error("No matching rule found in object.");
  } else if (typeof rule === 'function') {
     // Function case: Execute the function to parse.
    const parseResult = rule(input);
    if (parseResult) {
        return parseResult;
    } else {
        throw new Error("Function rule failed to parse.");
    }
  } else {
    throw new Error("Invalid grammar rule type.");
  }
}

/**
 * Helper function to parse a sequence of characters until a specific terminator is found.
 * @param {string} input The input string to parse.
 * @param {string} terminator The terminator character.
 * @returns {{ value: string, remainingInput: string }|null} An object containing the parsed value and remaining input, or null if the terminator is not found.
 */
function parseUntil(input, terminator) {
  const terminatorIndex = input.indexOf(terminator);
  if (terminatorIndex === -1) {
    return null; // Terminator not found
  }

  const value = input.substring(0, terminatorIndex);
  const remainingInput = input.substring(terminatorIndex + terminator.length);

  return { value: value, remainingInput: remainingInput };
}

module.exports = {
  parse,
  parseUntil
};