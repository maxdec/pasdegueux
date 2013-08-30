(function() {

  google.load('search', '1');

  var container = document.getElementById('container');
  var label = document.getElementById('label');
  var input = document.getElementById('noun');
  var bg = document.getElementById('background');
  var lastNavigation = null;
  var searcher;
  var keyword = '';

  sizeText();
  window.addEventListener('resize', sizeText);
  input.addEventListener('keypress', handleKey);

  if (/WebKit/.test(window.navigator.userAgent)) {
    input.focus();
    input.value = input.value;
  }

  function sizeText() {
    var MIN_SIZE = 32;
    var MARGIN = 0.1;
    var LINE_HEIGHT = 1.1;
    var LINE_COUNT = 4;

    var documentHeight = container.clientHeight;
    var documentWidth = container.clientWidth * 0.8;
    var labelMargin = documentHeight * MARGIN;
    var labelHeight = Math.min(documentWidth, documentHeight) - 2 * labelMargin;
    var fontSize = labelHeight / (LINE_HEIGHT * LINE_COUNT);

    label.style.fontSize = input.style.fontSize = Math.max(MIN_SIZE, fontSize) + 'px';
    label.style.left = labelMargin + 'px';
  }

  function handleKey(event) {
    if (event.keyCode == 13) {
      var subdomain = input.value
        .substr(0, input.maxLength)
        .replace(/[^a-z0-9A-Z-]+/g, '.')
        .replace(/(^\.|\.$)/g, '')
        .toLowerCase();

      //search(subdomain);
      // var newHREF = 'http://'+subdomain+'.pasdegueux.com/';
      // window.history.pushState('', subdomain+' ? PAS DEGUEUX', newHREF);

      if (subdomain && subdomain != lastNavigation) {
        lastNavigation = subdomain;
        document.location.href = 'http://' +
          subdomain +
          '.pasdegueux.com' +
          document.location.pathname;
      } else {
        document.location.href = 'http://pasdegueux.com';
      }
    }
  }

  function randImg() {
    var nb = Math.floor((Math.random()*12)+1);
    var url = 'http://pasdegueux.com/img/'+nb+'.jpg';
    bg.style.backgroundImage = 'url('+url+')';
  }

  function notFound() {
    bg.style.backgroundImage = 'url(http://pasdegueux.com/img/404.jpg)';
  }

  function search() {
    searcher = new google.search.ImageSearch();
    searcher.setRestriction(
      google.search.ImageSearch.RESTRICT_IMAGESIZE,
      google.search.ImageSearch.IMAGESIZE_LARGE
    );
    searcher.setRestriction(
      google.search.Search.RESTRICT_SAFESEARCH,
      google.search.Search.SAFESEARCH_OFF
    );
    searcher.setSearchCompleteCallback(this, searchComplete);

    console.log('Search: '+keyword);
    searcher.execute(keyword);
  }

  function searchComplete() {
    // Check that we got results
    if (searcher.results && searcher.results.length > 0) {
      var url = searcher.results[0].url;
      console.log(url);
      bg.style.backgroundImage = 'url('+url+')';

      //clear search
      searcher.clearResults();
    } else {
      console.log('No results.');
      notFound();
    }
  }


  var domainParts = window.location.host.split('.');
  if (domainParts.length > 2) {
    for (var i = 0; i < domainParts.length - 2; i++) {
      keyword += domainParts[i];
      keyword += ' ';
    }
    keyword = keyword.trim();
    document.title = keyword.toUpperCase() + ' ? PAS DEGUEUX';
    input.value = keyword;
    if (keyword === 'baptou') {
      randImg();
    } else {
      google.setOnLoadCallback(search);
    }
  } else {
    randImg();
  }

})();
