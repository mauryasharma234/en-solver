const formulaRepository = require('../repositories/formulaRepository')

const formulajs = require('@formulajs/formulajs');


// Assign formulajs functions to global
Object.assign(global, formulajs);

const create = async (data) => {
    return await formulaRepository.create(data);
}
const update = async (data) => {
    return await formulaRepository.update(data);
}
const getOne = async (id) => {
    return await formulaRepository.getOne(id);
}
const getAll = async (req) => {
    return await formulaRepository.getAll(req);
}
const execute = async (req) => {
    const findRulesResult = await findRules(req.body.metaData, req.body.clientName, req.body.ruleIds);
    const evaluateResult = evaluate(findRulesResult, req.body.input);

    return evaluateResult;
}

const findRules = async (metaData, clientName, ruleIds) => {
    if (ruleIds == undefined || ruleIds.length == 0) {
        const findRules = await formulaRepository.findRules(metaData, clientName);
        return findRules;
    }else{
        const findRules = await formulaRepository.findRulesFromIds(ruleIds);
        return findRules;
    }
}


const evaluate = (rule, input) => {
    const expression = rule[0].dataValues.expression;

    let formula = extractFormula(expression);
    let replacedFormula = replaceVariables(formula, input);

    console.log("replacedFormula", replacedFormula);
    const result = eval(replacedFormula);
  
    const finalResult = expression + " " + result;
    return finalResult;
  };
  
function extractFormula(expression) {
    const startIndex = expression.indexOf("##") + 2;
    const endIndex = expression.indexOf("//");
  
    if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex) {
      return expression.substring(startIndex, endIndex).trim();
    } else {
      throw new Error("Invalid expression format: Formula could not be extracted.");
    }
}
function replaceVariables(formula, variables) {
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
module.exports = {create, update, getOne, getAll, execute};