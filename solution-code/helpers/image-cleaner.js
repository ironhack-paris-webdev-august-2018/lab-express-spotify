function imageCleaner(spotifyObject){
  if (spotifyObject.images[0]){
    return spotifyObject.images[0].url;
  } else {
    return "https://placeholdit.imgix.net/~text?txtsize=33&txt=250%C3%97250&w=250&h=250"
  }
}

module.exports = imageCleaner;
