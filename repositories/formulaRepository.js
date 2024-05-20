const formula = require('../db/models/formula');
const {Op, Sequelize} = require('sequelize');

const create = async (data) => {
    const result = await formula.create({
        clientName: data.clientName,
        metadata: data.metaData,
        expression: data.expression,
        variables: data.variables
    });
    return result;
}


const update = async (data) => {
    const result = await formula.update({
        clientName: data.clientName,
        metadata: data.metaData,
        expression: data.expression,
        variables: data.variables
    }, {
        where: {
            id: data.id
        }
    });
    return {
        rowsAffected: result,
        id: data.id
    };
}

const getOne = async (id) => {
    const result = await formula.findOne({
        where: {
            id: id
        }
    });
    return result;
}

const getAll = async (req) => {
    const { limit = 10, offset = 0, pageNumber = 1 } = req.query;

    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);
    const parsedPageNumber = parseInt(pageNumber, 10);

    const actualOffset = parsedOffset + (parsedPageNumber - 1) * parsedLimit;

    try {
        const data = await formula.findAll({
            limit: parsedLimit,
            offset: actualOffset,
        });

        const totalCount = await formula.count();

        return {data, totalCount};
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const findRulesFromIds = async (ruleIds) => {
    const result = await formula.findAll({
        where: {
            id: ruleIds
        }
    });
    return result;
}

const findRules = async (metaData, clientName) => {
    const metadataConditions = Object.keys(metaData).map((key) => {
      return Sequelize.literal(`metadata->>'${key}' = '${metaData[key]}'`);
    });
  
    const whereClause = {
      clientName: clientName,
      [Op.and]: metadataConditions,
    };
  
    const result = await formula.findAll({
      where: whereClause,
    });
  
    return result;
};

module.exports = {create, update, getOne, getAll, findRulesFromIds, findRules}