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
        'Seven Lions',
        'Adventure Club',
        'Armin van Buuren',
      ],
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
