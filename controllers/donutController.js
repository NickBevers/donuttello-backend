const Donut = require('../models/donut');

// Get all donuts (possible sorting by name, base, frosting, sprinkles, votes, dfateCreated)
const getAll = (req, res, next) => {
    // make constant of the query parameter 'sort' (if not there, it will return undefined)
    const sortingMethod = req.query.sort;
    let sortBy = {};

    // check the order by which the user wants to sort the donuts (default is ascending order)
    switch (req.query.order) {
        case "asc":
            sortingOrder = 1;
            break;
        case "desc":
            sortingOrder = -1;
            break;
        default:
            sortingOrder = 1;
    }

    // set the sorting method based on the query parameter 'sort', default is $natural (which is the order in which the donuts were created)
    sortingMethod ? sortBy[sortingMethod] = sortingOrder : sortBy = { $natural: sortingOrder };
    console.log(sortBy);

    Donut.find({}, (err, donuts) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        res.status(200).json({ status: "success", message: "All donuts retrieved.", data: donuts, donutCount: donuts.length });
    }).sort(sortBy);
};

// Get a single donut by id
const getOne = (req, res, next) => {
    Donut.findById(req.params.id, (err, donut) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        res.status(200).json({ status: "success", message: `Got data for donut ${req.params.id}.`, data: donut, donutCount: donut.length });
    });
};

// Create a new donut (no need to initiatie a new donut object, just call create on the model with the body of the request)
const create = (req, res, next) => {
    Donut.create(req.body, (err, donut) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        res.status(200).json({ status: "success", message: `You created a donut called "${donut.name}".`, data: donut, donutCount: donut.length });
    });
};

// Update a donut by id
const update = (req, res, next) => {
    Donut.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, donut) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        res.status(200).json({ status: "success", message: `Updated data for donut ${req.params.id}.`, data: donut, donutCount: donut.length });
    });
}

// Delete a donut by id
const remove = (req, res, next) => {
    Donut.findByIdAndDelete(req.params.id, (err, donut) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        res.status(200).json({ status: "success", message: `Donut ${req.params.id} has been removed from our database.`, data: donut, donutCount: donut.length });
    });
}

module.exports = { getAll, getOne, create, update, remove }
