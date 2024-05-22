const {create, update, getOne, getAll, getFromMetadata, execute, deleteFormula, getClientNames} = require('../controllers/formulaController');


const router = require('express').Router()

router.route('/create').post(create);

router.route('/update').put(update);

router.route('/getOne').get(getOne);

router.route('/getAll').get(getAll);

router.route('/getFromMetadata').get(getFromMetadata);

router.route('/executeFormula').post(execute);

router.route('/deleteFormula').delete(deleteFormula);

router.route('/getClientNames').get(getClientNames);

module.exports = router;