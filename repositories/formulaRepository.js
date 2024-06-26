const formula = require('../db/models/formula');
const {Op, Sequelize} = require('sequelize');

const create = async (data) => {
    console.log("Create formula repository called\n")
    const result = await formula.create({
        clientName: data.clientName,
        metadata: data.metaData,
        expression: data.expression,
        variables: data.variables
    });
    console.log("Response returned from db for create formula\n", result)
    return result;
}

const update = async (data) => {
    console.log("Update formula repository called\n")
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
    console.log("Response returned from db for update formula\n", result)
    return {
        rowsAffected: result,
        id: data.id
    };
}

const getOne = async (id) => {
    console.log("Get one formula repository called\n");
    const result = await formula.findOne({
        where: {
            id: id,
            deletedAt: null
        }
    });
    console.log("Response returned from db for get one formula\n", result);
    return result;
};

const getAll = async (req) => {
    console.log("Get all formula repository called\n")
    const { limit = 10, pageNumber = 1, search = "" } = req.query;

    const parsedLimit = parseInt(limit, 10);
    const offSet = parsedLimit * (parseInt(pageNumber, 10) - 1)
    // const parsedPageNumber = parseInt(pageNumber, 10);

    // const actualOffset = parsedOffset + (parsedPageNumber - 1) * parsedLimit;
    const whereClause = {
        [Op.or]: [
          Sequelize.literal(`metadata::text ILIKE '%${search}%'`)
        ],
        deletedAt: null,
      };

    const data = await formula.findAll({
            limit: parsedLimit,
            offset: offSet,
            where: whereClause,
            order: [['updatedAt', 'DESC']]
    });
    const searchCount = await formula.count({
        where: whereClause
    });
    const totalCount = await formula.count();
    console.log("Response returned from db for get all formula\n", data)
    return {data, totalCount, searchCount};
}

const getRuleFromId = async (ruleId) => {
    console.log("Find rule from id repository called\n")
    const result = await formula.findOne({
        where: {
            id: ruleId,
            deletedAt: null
        }
    });
    console.log("Response returned from db for find rule from id\n", result)
    return result;
}

const findRule = async (metaData, clientName) => {
    console.log("Find rules repository called\n");
    const metadataConditions = Object.keys(metaData).map((key) => {
      return Sequelize.literal(`metadata->>'${key}' = '${metaData[key]}'`);
    });
  
    const whereClause = {
      clientName: clientName,
      [Op.and]: metadataConditions,
      deletedAt: null,
    };
  
    const result = await formula.findOne({
      where: whereClause,
      order: [['updatedAt', 'DESC']],
    });
    console.log("Response returned from db for find rule\n", result);
    return result;
};

const deleteFormula = async (id) => {
    console.log("Delete formula repository called\n");
    
    const result = await formula.update(
        { deletedAt: Sequelize.literal('CURRENT_TIMESTAMP') },
        { where: { id: id } }
    );
    
    console.log("Response returned from db for delete formula\n", result);
    return {
        rowsAffected: result,
        id: id
    };
};
const getFromMetadata = async (req) => {
    console.log("Get formula from metadata repository called\n")
    const { query } = req.query;  // Assuming the query parameter is passed like ?query=something
    const whereClause = {
        [Op.or]: [
          Sequelize.literal(`metadata::text ILIKE '%${query}%'`)
        ],
      };

      const result = await formula.findAll({
        where: whereClause,
      });
    
      return result;
}
const getClientNames = async () => {
    const clientNames = await formula.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('clientName')), 'clientName']
        ],
        raw: true,
    });
    const names = clientNames.map(client => client.clientName);

    return names;
}
module.exports = {create, update, getOne, getAll, getRuleFromId, findRule, deleteFormula, getFromMetadata, getClientNames}