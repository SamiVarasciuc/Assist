const express = require('express')
const app = express()
const router = express.Router
const port = 3000

const httpReq = require('request-promise');
const jqueryChe = require('cheerio');

baseURL = `https://assist-software.net/testimonials`;
pageURL = '?page=';
newURL = baseURL;
options = {
    uri: newURL,
    transform: function (body) {
      return jqueryChe.load(body);
    }
  };
  var thenum = -1;
  var testim = [];
  var countries = [];
  var final = [];
  var isFinal = false;
  var iii = 0;


  httpReq(options)
  .then(($) => {
    var text= $('.pager-last').children('a').attr('href');
    thenum = text.match(/\d+/)[0];
    $('.testimonial-job').each(function(i, elem) {
      var authors= [];
      authors[i]=$(this).text();
      console.log(i, authors[i]);
    }); 

    scrapURL();

    function scrapURL(){
      iii++;
      if(iii>thenum){
        isFinal = true;
        return;
      }

      newURL = baseURL + pageURL + iii;

      options = {
        uri: newURL,
        transform: function (body) {
          return jqueryChe.load(body);
        }
      };

      httpReq(options)
      .then(($) => {

       var kk = 0;
       $('div.testimonial-author').each(function(i, elem) {
        var job = [];
        var job1 = $('.img-responsive')[kk];
        job.push(job1.attribs.src);
        job.push($(this).children('.testimonial-author').text());
        kk++;
        $(this).children('.testimonial-country').children('.country').each(function(j, elem) {
          var country = $(this).text();
          if (testim[country] != undefined) {          
            testim[country].push(job);
          } else {
            countries.push(country);
            testim[country] = [job];
          }
        });     
       });
       scrapURL();
       
      })
      .catch((err) => {
        console.log(err);
      });  
    }

  })
  .catch((err) => {
    console.log(err);
  });  

  setTimeout(function() { delay(); }, 1000);

  function delay() {
    if (isFinal == true) {
      countries.sort();           
      console.log(testim);
      console.log(countries);
      countries.forEach(logArrayElements);
      return;
    }    

    setTimeout(function() { delay(); }, 1000);
  }

  var info = " ";
  function logArrayElements(element, index, array) {
    console.log('a[' + index + '] = ' + element);
    console.log(testim[element]);
    info += " <br> " + " Tara: " + element+ " <br> ";
    testim[element].forEach(logTestim);
  }
  
  function logTestim(element, index, array) {    
    info += " <h3> " + " Nume: " + element[1] + " </h3> " + " Foto: " + "<img src=\"" + element[0] + "\" height='100' width='100'>" + " <br> ";
  }

app.get('/', function(req, res){
   res.send(info);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
