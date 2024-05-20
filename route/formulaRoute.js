const {create, update, getOne, getAll, getFromMetadata, execute, deleteFormula} = require('../controllers/formulaController');

const router = require('express').Router()

router.route('/create').post(create);

router.route('/update').put(update);

router.route('/getOne').get(getOne);

router.route('/getAll').get(getAll);

router.route('/getFromMetadata').get(getFromMetadata);

router.route('/executeFormula').post(execute);

router.route('/deleteFormula').delete(deleteFormula);

module.exports = router;