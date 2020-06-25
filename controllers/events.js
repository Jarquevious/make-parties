var moment = require('moment');
//events.js

module.exports = function (app, models) {

    // INDEX
    app.get('/', (req, res) => {
        models.Event.findAll({ order: [['createdAt', 'DESC']] }).then(events => {
            res.render('events-index', { events: events });
        })
    })

    // SHOW
    app.get('/events/:id', (req, res) => {
        models.Event.findByPk(req.params.id, { include: [{ model: models.Rsvp }] }).then(event => {
            let createdAt = event.createdAt;
            createdAt = moment(createdAt).format('MMMM Do YYYY, h:mm:ss a');
            event.createdAtFormatted = createdAt;
            res.render('events-show', { event: event });
        }).catch((err) => {
            console.log(err.message);
        })
    });
}