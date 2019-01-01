var output = document.getElementById('output');

function createSVGElement(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag || "svg");
}

var fretCount = 24;
var stringCount = 6;
var margin = 20;
var stringLineWidth = 2;
var fretLineWidth = 2;
var bridgeLineWidth = 8;
var fretStringAspect = 5/2;
var lineCap = 'round';
var offsetX = 20;
var offsetY = 20;

function drawFrets(x, y, innerWidth, innerHeight) {

  var group = createSVGElement('g');

  var stringGroup = createSVGElement('g');
  stringGroup.setAttribute('stroke', '#000');

  for (var i = 0; i < stringCount; ++i) {
    var stringPath = createSVGElement('path');
    var fromX = offsetX;
    var fromY = offsetY + i * innerHeight / (stringCount - 1);
    var toX = offsetX + innerWidth;
    var toY = offsetY + i * innerHeight / (stringCount - 1);
    stringPath.setAttribute('d', 'M' + fromX + ' ' + fromY + 'L' + toX + ' ' + toY);

    stringGroup.appendChild(stringPath);
  }

  var bridgeGroup = createSVGElement('g');
  bridgeGroup.setAttribute('stroke', '#000');
  bridgeGroup.setAttribute('stroke-width', 4);
  bridgeGroup.setAttribute('stroke-linecap', 'square');

  var bridgePath = createSVGElement('path');
  bridgePath.setAttribute('d', 'M' + offsetX + ' ' + offsetY + 'L' + offsetX + ' ' + (offsetY + innerHeight))

  bridgeGroup.appendChild(bridgePath);

  var fretGroup = createSVGElement('g');
  fretGroup.setAttribute('stroke', '#000');

  for (var i = 0; i < fretCount; ++i) {
    var fretPath = createSVGElement('path');
    var fromX = offsetX + i * innerWidth / (fretCount - 1);
    var fromY = offsetY;
    var toX = offsetX + i * innerWidth / (fretCount - 1);
    var toY = offsetY + innerHeight;
    fretPath.setAttribute('d', 'M' + fromX + ' ' + fromY + 'L' + toX + ' ' + toY);

    fretGroup.appendChild(fretPath);
  }

  group.appendChild(stringGroup);
  group.appendChild(bridgeGroup);
  group.appendChild(fretGroup);

  return group;

}

var notes = {
  'C': 0,
  'C\u266F': 1,
  'D\u266D': 1,
  'D': 2,
  'D\u266F': 3,
  'E\u266D': 3,
  'E': 4,
  'F': 5,
  'F\u266F': 6,
  'G\u266D': 6,
  'G': 7,
  'G\u266F': 8,
  'A\u266D': 8,
  'A': 9,
  'A\u266F': 10,
  'B\u266D': 10,
  'B': 11
};

var strings = [['E'],['B'],['G'],['D'],['A'],['E']];
var fretCount = 24;
var scale = [
  'C',
  'C\u266F/D\u266D',
  'D',
  'D\u266F/E\u266D',
  'E',
  'F',
  'F\u266F/G\u266D',
  'G',
  'G\u266F/A\u266D',
  'A',
  'A\u266F/B\u266D',
  'B'
];
var modes = {
    ionian: [2, 2, 1, 2, 2, 2], // major
    dorian: [2, 1, 2, 2, 2, 1],
    phrygian: [1, 2, 2, 2, 1, 2],
    lydian: [2, 2, 2, 1, 2, 2],
    mixolydian: [2, 2, 1, 2, 2, 1],
    aeolian: [2, 1, 2, 2, 1, 2], // nat. minor
    locrian: [1, 2, 2, 1, 2, 2],

    acoustic: [2, 2, 2, 1, 2, 1],
    algerian: [2, 1, 3, 1, 1, 3],
    altered: [1, 2, 1, 2, 2, 2]
}

var fullStrings = strings.map(function(string) {
    var start = scale.indexOf(string[0]);
    var items = [scale[start]];
    for (var i = 0; i < fretCount; ++i) {
        items.push(scale[(start + i + 1) % scale.length]);
    }
    return items;
})

var scale = 'mixolydian';
var root = 'G\u266F/A\u266D';

function formatNoteToHTML(note) {
  return note.replace(/(\u266F|\u266D)/g, '<span class="sym">$1</span>')
}

function formatScaleToHTML(scale) {
  return scale.substr(0, 1).toUpperCase() + scale.substr(1);
}

var scaleNotes = modes[scale].reduce(function(result, step) {
    var lastNote = scale.indexOf(result[result.length - 1]);
    return result.concat([scale[(lastNote + step) % scale.length]]);
}, [root]);

var scaleStrings = fullStrings.map(function(string) {
    return string.map(function(note) {
        return (scaleNotes.indexOf(note) !== -1) ? note : "";
    });
});

output.innerHTML = scaleStrings.map(function(string) {
    return string.map(function(note) {
        return formatNoteToHTML(note) + Array(5 - note.length + 1).join(' ');
    }).join('|');
}).join('\n' + Array((fretCount + 1) * 6).join('-') + '\n');

document.querySelector('#scale').textContent = formatScaleToHTML(scale);
document.querySelector('#root').innerHTML = formatNoteToHTML(root);

var scaleListElement = document.querySelector('#scales');
for (var scale in modes) {
  var scaleElement = document.createElement('li');
  scaleElement.innerHTML = formatScaleToHTML(scale);
  scaleListElement.appendChild(scaleElement);
}

var noteListElement = document.querySelector('#roots');
for (var note in notes) {
  var noteElement = document.createElement('li');
  noteElement.innerHTML = formatNoteToHTML(note);
  noteListElement.appendChild(noteElement);
}

//G<span class="sym">&#x266F;</span>/A<span class="sym">&#x266D;</span>

var width = 1200;
var height = 200;

var svg = createSVGElement();
svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

var innerHeight = height - offsetY * 2;
var innerWidth = width - offsetX * 2;

var group = drawFrets(offsetX, offsetY, innerWidth, innerHeight);

var indicatorsGroup = createSVGElement('g');
indicatorsGroup.setAttribute('text-anchor', 'middle');
scaleStrings.forEach(function (string, i) {
  console.log(i);

  string.forEach(function (fret, j) {
    if (fret) {
      var indicatorGroup = createSVGElement('g');
      var indicatorText = createSVGElement('text');
      var indicatorPath = createSVGElement('circle');

      var fromX = offsetX + j * innerWidth / (fretCount - 1);
      var fromY = offsetY + i * innerHeight / (stringCount - 1);
      var toX = offsetX + (j + 1) * innerWidth / (fretCount - 1);
      var toY = offsetY + (i + 1) * innerHeight / (stringCount - 1);
      var cx = fromX / 2 + toX / 2;
      var cy = fromY / 2 + toY / 2;

      indicatorText.textContent = fret;
      indicatorText.setAttribute('x', cx);
      indicatorText.setAttribute('y', cy);

      indicatorPath.setAttribute('cx', cx);
      indicatorPath.setAttribute('cy', fromY);
      indicatorPath.setAttribute('r', toX / 4 - fromX / 4);

      indicatorGroup.appendChild(indicatorText);
      indicatorGroup.appendChild(indicatorPath);
      indicatorsGroup.appendChild(indicatorGroup);
    }
    console.log(fret, j);

  });
});

svg.appendChild(group);
svg.appendChild(indicatorsGroup);

document.querySelector('#frets').appendChild(svg);
