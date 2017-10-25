var _fs = require("fs");
var fs = _fs.default || _fs;

var d1 = require('./fashion.json');
var d2 = require('./digital.json');
var d3 = require('./ideas.json');

const result = [].concat(
  d1.map((d) => {
    return {
      name: d.name,
      image: d.image,
      url: d.url,
      description: `${d.class2}: ${d.description}`,
      source: 'fashion',
      tag: 'exciting',
    };
  }),
  d2.map((d) => {
    return {
      name: d.category,
      image: d.imgsrc,
      url: d.url,
      description: d.description,
      source: 'digital',
      tag:'boring', /* tag for greedy algoritym */
    };
  }),
  d3.map((d) => {
    return {
      name: d.name,
      image: d.img,
      url: d.url,
      description: d.content,
      source: 'ideas',
      tag:'exciting',
    };
  })
);

fs.writeFile('data.json', JSON.stringify(result), () => {
  console.log('Done ;)');
});
