import jsonschema from 'jsonschema';

const Validator = jsonschema.Validator;
const v = new Validator();

// This seed data is used to populate the database with music events, artists, and tracks
const data = {
  events: [
    {
      name: 'Electronic Daisy Carnival',
      year: '2016',
      days: 3,
      ref: 'EDC',
      artists: [
        '12th Planet',
        '4B',
        'A-Trak',
        'Above & Beyond',
        'Adrenalize',
        'Adventure Club',
        'Afrojack',
        'Alesso',
        'Alison Wonderland',
        'Aly & Fila',
        'Angerfist',
        'Armand Van Helden',
        'Armin Van Buuren',
        'Astrix',
        'Audiotricz',
        'Axwell /\\ Ingrosso',
        'Baumer',
        'Bioweapon',
        'Botnek',
        'Brennan Heart',
        'Brennen Grey',
        'Brillz',
        'Bro Safari',
        'Carnage',
        'Rusko',
        'The Chainsmokers',
        'Code Black',
        'Coone',
        'Coyote Kisses',
        'Crisis Era',
        'Crizzly',
        'Culture Shock',
        'Da Tweekaz',
        'Dada Life',
        'Darksiderz',
        'Darren Styles',
        'Dash Berlin',
        'Datsik',
        'Deorro',
        'Dimitri Vegas & Like Mike',
        'DJ Isaac',
        'DJ Snake',
        'DJ Trance',
        'Don Diablo',
        'Dr. Fresch',
        'Duke Dumont',
        'Ephwurd',
        'Eptic',
        'Eric Prydz',
        'Excision',
        'Ferry Corsten',
        'Flux Pavilion',
        'Gaia',
        'Galantis',
        'Gareth Emery',
        'Giraffage',
        'GTA',
        'Habstrakt',
        'Hardwell',
        'Hotel Garuda',
        'Jason Bentley',
        'Jauz',
        'John O\'Callaghan',
        'Kaskade',
        'Kasra',
        'Knife Party',
        'Kshmr',
        'Lady Faith',
        'LNY TNZ',
        'LUMBERJVCK',
        'Markus Schulz',
        'Marshmello',
        'Martin Garrix',
        'Martin Solveig',
        'Matrix & Futurebound',
        'MC DINO',
        'Mefjus',
        'Mercer',
        'My Digital Enemy',
        'NGHTMRE',
        'Oliver Heldens',
        'Ookay',
        'Party Favor',
        'Paul Oakenfold',
        'Paul Van Dyk',
        'Pendulum',
        'Protohype',
        'Radical Redemption',
        'Richie Hawtin',
        'RL Grime',
        'Seven Lions',
        'Slander',
        'Sleepy Tom',
        'Snails',
        'Sonny Fodera',
        'Sylence',
        'Technoboy',
        'The Chainsmokers',
        'The Magician',
        'The Prototypes',
        'Tiësto',
        'TJR',
        'TNT',
        'Tommy Trash',
        'Totally Enormous Extinct Dinosaurs',
        'Troyboi',
        'Tycho',
        'Umek',
        'Valentino Khan',
        'W&W',
        'Wasted Penguinz',
        'What So Not',
        'Yellow Claw',
        'Zander',
        'Zedd',
        'Zomboy',
      ],
    },
    {
      name: 'Hard Summer',
      year: '2016',
      days: 2,
      ref: 'HS',
      artists: [
        'Porter Robinson',
        'Tchami',
      ]
    }
  ],
};

const devoData = {
  events: [
    {
      name: 'Electronic Daisy Carnival',
      year: '2016',
      days: 3,
      ref: 'EDC',
      artists: [
        '12th Planet',
        '219 Boys',
      ],
    },
    {
      name: 'Hard Summer',
      year: '2016',
      days: 2,
      ref: 'HS',
      artists: [
        'Porter Robinson',
        'Tchami',
      ]
    }
  ],
};

// Represents the data variable above, for schema validation
const dataSchema = {
  id: '/DataSchema',
  type: 'object',
  properties: {
    events: { type: 'array', items: { type: 'object', $ref: '/EventSchema' } },
  },
  required: ['events'],
};

// Represents the list of events
const eventSchema = {
  id: '/EventSchema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    year: { type: 'string' },
    days: { type: 'number' },
    ref: { type: 'string' },
    artists: { type: 'array', items: { type: 'string' } },
  },
  required: ['name', 'year', 'days', 'ref', 'artists'],
};

v.addSchema(eventSchema, '/EventSchema');

// Validate data against the dataSchema and returns ValidationResult list
function validate(data) {
  return v.validate(data, dataSchema);
}

export default {
  devoData,
  data,
  validator: {
    validate
  }
}
