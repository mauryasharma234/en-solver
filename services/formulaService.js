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
    let replacedFormula = replaceVariables(formula, input);

    const result = eval(replacedFormula);
  
    const finalResult = expression + " " + result;
    return finalResult;
  };
  
function extractFormula(expression) {
    console.log("Extract formula service called\n");
    const startIndex = expression.indexOf("##") + 2;
    const endIndex = expression.indexOf("//");
  
    if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex) {
      return expression.substring(startIndex, endIndex).trim();
    } else {
      throw new Error("Invalid expression format: Formula could not be extracted.");
    }
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

const deleteFormula = async (id) => {
    console.log("Delete formula service called\n");
    return await formulaRepository.deleteFormula(id);
}
module.exports = {create, update, getOne, getAll, execute, deleteFormula};