const formulaSerice = require('../services/formulaService')

const create = async (req, res) => {
    try{
        console.log("Request received for creating formula\n")
        const result = await formulaSerice.create(req.body);
        return res.status(201).json(result);
    }catch(err){
        console.error("Error in creating formula\n", err)
        res.status(500).json({ message: err.message });
    }   
} 

const update = async (req, res) => {
    try{
        console.log("Request received for updating formula\n")
        const result = await formulaSerice.update(req.body);
        return res.status(200).json(result);
    }catch(err){
        console.error("Error in updating formula\n", err)
        res.status(500).json({ message: err.message });
    }
}

const getOne = async (req, res) => {
    try{
        console.log("Request received for getting one formula\n")
        const id = req.query.id;
        const result = await formulaSerice.getOne(id);
        return res.status(200).json(result);

    }catch(err){
        console.error("Error in getting one formula\n", err)
        res.status(500).json({ message: err.message });
    }
}

const getAll = async (req, res) => {
    try{
        console.log("Request received for getting all formula\n")
        const result = await formulaSerice.getAll(req);
        return res.status(200).json(result);
    }catch(err){
        console.error("Error in getting all formula\n", err)
        res.status(500).json({ message: err.message });
    }
}

const getFromMetadata = async (req, res) => {

}

const execute = async (req, res) => {
    try{    
        console.log("Request received for executing formula\n")
        const result = await formulaSerice.execute(req);
        return res.status(200).json(result);
    }catch(err){
        console.error("Error in executing formula\n", err)
        res.status(500).json({ message: err.message });
    }    
}

const deleteFormula = async (req, res) => {

}


module.exports = {create, update, getOne, getAll, getFromMetadata, execute, deleteFormula}