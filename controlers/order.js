const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function (req, res) {

    const query = {
        user: req.user.id
    };

    if (req.query.start) {
        query.data = {
            $gte: req.query.start
        }
    }

    if (req.query.end) {
        if (!query.data) {
            query.data = {}
        }
        query.data['$lte'] = req.query.end
    }
    if (req.query.order) {
        query.order = +req.query.order
    }
    try {
        const order = await Order
            .find(query)
            .sort({data: 1})
            .skip(+req.query.offset)
            .limit(+req.query.limit);
        res.status(200).json(order);
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.create = async function (req, res) {
    try {
        const lastOrder = await Order.findOne({user: req.user.id}).sort({data: -1});

        const maxOrder = lastOrder ? lastOrder.order : 0;

        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        }).save();

        res.status(201).json(order);
    } catch (e) {
        errorHandler(res, e);
    }
};
