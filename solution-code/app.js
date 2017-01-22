const express         = require('express');
const path            = require('path');
const favicon         = require('serve-favicon');
const logger          = require('morgan');
const bodyParser      = require('body-parser');
const expressLayouts  = require('express-ejs-layouts');
const imageCleaner    = require('./helpers/image-cleaner');
const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(layoutPicker);
app.locals.imageCleaner = imageCleaner;

app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/artists', function(req, res, next) {
  let searchTerm = req.query.artist;

  spotify.searchArtists(searchTerm, {}, (err, data) => {
    if (err) throw err;

    let artists = data.body.artists.items;

    res.render('artists/index', {
      artists: artists,
      searchTerm: searchTerm
    });
  });
});

app.get('/albums/:artistId', function(req, res, next) {
  let artistId = req.params.artistId;

  spotify.getArtistAlbums(artistId, {}, (err, data) => {
    if (err) throw err;

    let albums = data.body.items;
    let artist = albums[0].artists.find(artist => artist.id === artistId);

    res.render('albums/index', {
      albums: albums,
      artist: artist.name
    });
  });
});

app.get('/tracks/:albumId', function(req, res, next) {
  let searchTerm = req.params.albumId;


  spotify.getAlbumTracks(searchTerm, {}, (err, data) => {
    if (err) throw err;

    let tracks = data.body.items;
    res.render('tracks/index', {
      tracks: tracks,
    });
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function layoutPicker(req, res, next){
  if (req.path === "/"){
    app.set('layout', 'layouts/home-layout');
  } else {
    app.set('layout', 'layouts/main-layout');
  }
  next();
}

module.exports = app;
