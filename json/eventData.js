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
        '219 Boys',
        '4B',
        'A-Trak',
        'Above & Beyond',
        'Ace Ventura',
        'Adrenalize',
        'Adventure Club',
        'Afrojack',
        'Alan Fitzpatrick',
        'Alesso',
        'Alison Wonderland',
        'Aly & Fila',
        'Amtrac',
        'Andy C',
        'Anevo',
        'Angerfist',
        'Anna Lunoe',
        'Armand Van Helden',
        'Armanni Reign',
        'Armin Van Buuren',
        'Aryay',
        'Astrix',
        'Astronomar',
        'Teddy Killerz',
        'Audiofreq',
        'Audiotricz',
        'Awe',
        'Axwell /\\ Ingrosso',
        'Bad Boy Bill',
        'Bad Company UK',
        'Baggi',
        'Bart Skils',
        'Baumer',
        'Ben Nicky',
        'Billy Kenny',
        'Bioweapon',
        'Bones',
        'Bot',
        'Botnek',
        'Brennan Heart',
        'Brennen Grey',
        'Brillz',
        'Bro Safari',
        'Brookes Brothers',
        'Carnage',
        'Rusko',
        'Chadwick',
        'The Chainsmokers',
        'Chris Lake',
        'Chris Liebing',
        'Chris Lorenzo',
        'Code Black',
        'Cookie Monsta',
        'Coone',
        'Coyote Kisses',
        'Craig Williams',
        'Crisis Era',
        'Crizzly',
        'Culture Shock',
        'Cyantific',
        'Da Tweekaz',
        'Dada Life',
        'Danny Howard',
        'Darksiderz',
        'Darren Styles',
        'Dash Berlin',
        'Datsik',
        'Dela Moontribe',
        'Delta Heavy',
        'Dem Ham Boyz',
        'Deorro',
        'Des Mcmahon',
        'Punk Dimension',
        'Dimitri Vegas & Like Mike',
        'DJ Isaac',
        'DJ Dan',
        'DJ Snake',
        'DJ Trance',
        'Doc Martin',
        'Doctor P',
        'Don Diablo',
        'Dr. Fresch',
        'Duke Dumont',
        'Dusky',
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
  data,
  validator: {
    validate
  }
}
