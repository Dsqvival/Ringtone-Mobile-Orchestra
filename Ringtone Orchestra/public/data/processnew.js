var _fs = require("fs");
var fs = _fs.default || _fs;

var d = require('./zhe800.json');

const result = [].concat(
  d.map((d) => {
    return {
      name: d.name,
      image: d.image,
      url: d.url,
      description: `${d.class2}: ${d.description}`,
      source: ${d.class1},
      tag: (if(discount < 5) 'exciting' else 'boring'),
    };
  })
);

fs.writeFile('data.json', JSON.stringify(result), () => {
  console.log('Done ;)');
});
