const formulaRepository = require('../repositories/formulaRepository')

const formulajs = require('@formulajs/formulajs');


// Assign formulajs functions to global
Object.assign(global, formulajs);

const create = async (data) => {
    console.log("Create formula service called\n");
    return await formulaRepository.create(data);
}
const update = async (data) => {
    console.log("Update formula service called\n");
    return await formulaRepository.update(data);
}
const getOne = async (id) => {
    console.log("Get one formula service called\n");
    return await formulaRepository.getOne(id);
}
const getAll = async (req) => {
    console.log("Get all formula service called\n");
    return await formulaRepository.getAll(req);
}
const execute = async (req) => {
    console.log("Execute formula service called\n");
    const findRuleResult = await findRule(req.body.metaData, req.body.clientName, req.body.ruleId);
    const evaluateResult = evaluate(findRuleResult, req.body.input);

    return evaluateResult;
}

const findRule = async (metaData, clientName, ruleId) => {
    console.log("Find rule service called\n");
    if (ruleId == undefined || ruleId.length == 0) {
        const findRule = await formulaRepository.findRule(metaData, clientName);
        return findRule;
    }else{
        const findRule = await formulaRepository.getRuleFromId(ruleId); 
        return findRule;
    }
}

const evaluate = (rule, input) => {
    console.log("Evaluate formula service called\n");
    const expression = rule.dataValues.expression;

    let formula = extractFormula(expression);
    let solutions = [];

    formula.forEach ((f) => {
        let replacedFormula = replaceVariables(f, input);
        const result = eval(replacedFormula);
        solutions.push(result);
    })
    const finalExpression = putValues(expression, solutions);
    return finalExpression;
  };
  
function extractFormula(expression) {
  console.log("Extract formula service called\n");
  const formulas = [];
  let startIndex = 0;

  while (startIndex < expression.length) {
      startIndex = expression.indexOf("##", startIndex);
      if (startIndex === -1) break;
      
      startIndex += 2; // Move past the "##"
      const endIndex = expression.indexOf("@@", startIndex);
      if (endIndex === -1) break;
      
      if (endIndex > startIndex) {
          const formula = expression.substring(startIndex, endIndex).trim();
          formulas.push(formula);
          startIndex = endIndex + 2; // Move past the "@@"
      } else {
          break;
      }
  }

  if (formulas.length === 0) {
      throw new Error("Invalid expression format: No formulas could be extracted.");
  }
  
  return formulas;
}

function replaceVariables(formula, variables) {
    console.log("Replace variables service called\n");
    return formula.replace(/\$([A-Za-z_]+)/g, (match, variable) => {
      if (variables[variable] !== undefined) {
        const value = variables[variable].value; // Access the value property
        const type = variables[variable].type; // Access the type property
        if (type === "string") {
          return `"${value}"`; // Enclose string value in double quotes
        } else {
          return value;
        }
      } else {
        return match;
      }
    });
}
function putValues(expression, solutions) {
  console.log("Replace formulas service called\n");
  let startIndex = 0;
  let solutionIndex = 0;
  let modifiedExpression = expression;

  while (startIndex < modifiedExpression.length && solutionIndex < solutions.length) {
      startIndex = modifiedExpression.indexOf("##", startIndex);
      if (startIndex === -1) break;

      const endIndex = modifiedExpression.indexOf("@@", startIndex + 2);
      if (endIndex === -1) break;

      if (endIndex > startIndex) {
          const replacement = solutions[solutionIndex].toString();
          // Replace the placeholder and the markers with the solution value
          modifiedExpression = modifiedExpression.slice(0, startIndex) + replacement + modifiedExpression.slice(endIndex + 2);
          // Update startIndex to continue searching after the replaced part
          startIndex = startIndex + replacement.length;
          solutionIndex++;
      } else {
          break;
      }
  }

  if (solutionIndex < solutions.length) {
      throw new Error("Not enough placeholders for the provided solutions.");
  }

  return modifiedExpression;
}


const deleteFormula = async (id) => {
    console.log("Delete formula service called\n");
    return await formulaRepository.deleteFormula(id);
}
const getFromMetadata = async (req) => {
    console.log("Get from metadata service called\n");
    return await formulaRepository.getFromMetadata(req);
}
module.exports = {create, update, getOne, getAll, execute, deleteFormula, getFromMetadata};