// Initialize express
const express = require('express')
const app = express()
// require handlebars
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const Handlebars = require('handlebars')


// connnecting to dabase model 
const models = require('./db/models');

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

app.use(methodOverride('_method'))


// Use "main" as our default layout
app.engine('handlebars', exphbs({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
// Use handlebars to render
app.set('view engine', 'handlebars');


// INITIALIZE BODY-PARSER AND ADD IT TO APP
app.use(bodyParser.urlencoded({ extended: true }));

require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);

// Index
app.get('/', (req, res) => {
  models.Event.findAll({ order: [['createdAt', 'DESC']] }).then(events => {

    // console.log(events);

    res.render('events-index', { events: events });
  })
})

// SHOW
app.get('/events/:id', (req, res) => {
  // Search for the event by its id that was passed in via req.params
  models.Event.findByPk(req.params.id).then((event) => {
    // If the id is for a valid event, show it
    res.render('events-show', { event: event })
  }).catch((err) => {
    // if they id was for an event not in our db, log an error
    console.log(err.message);
  })
})

// CREATE
app.post('/events', (req, res) => {
  models.Event.create(req.body).then(event => {
    // Redirect to events/:id
    res.redirect(`/events/${event.id}`)

  }).catch((err) => {
    console.log(err)
  });
})

// EDIT
app.get('/events/:id/edit', (req, res) => {
  models.Event.findByPk(req.params.id).then((event) => {
    res.render('events-edit', { event: event });
  }).catch((err) => {
    console.log(err.message);
  })
});

// UPDATE
app.put('/events/:id', (req, res) => {
  models.Event.findByPk(req.params.id).then(event => {
    event.update(req.body).then(event => {
      res.redirect(`/events/${req.params.id}`);
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
});

// NEW
app.get('/event/new', (req, res) => {
  res.render('events-new', {});
})

// DELETE
app.delete('/events/:id', (req, res) => {
  models.Event.findByPk(req.params.id).then(event => {
    event.destroy();
    res.redirect(`/`);
  }).catch((err) => {
    console.log(err);
  });
})

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})