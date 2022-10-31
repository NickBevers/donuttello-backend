const Donut = require('../models/donut');

const getAll = (req, res, next) => {
    Donut.find({}, (err, donuts) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        res.status(200).json(donuts);
    });
};

const getOne = (req, res, next) => {
    Donut.findById(req.params.id, (err, donut) => {
        if (err) {
        res.status(404).json({ error: err });
        }
        res.status(200).json(donut);
    });
};

const create = (req, res, next) => {
    Donut.create(req.body, (err, donut) => {
        if (err) {
        res.status(404).json({ error: err });
        }
        res.status(200).json(donut);
    });
};

const update = (req, res, next) => {
    Donut.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, donut) => {
        if (err) {
        res.status(404).json({ error: err });
        }
        res.status(200).json(donut);
    });
}

const remove = (req, res, next) => {
    Donut.findByIdAndDelete(req.params.id, (err, donut) => {
        if (err) {
        res.status(404).json({ error: err });
        }
        res.status(200).json(donut);
    });
}

module.exports = { getAll, getOne, create, update, remove }
