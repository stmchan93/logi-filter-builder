export const Value2SQLValue = new Map();

const DateTimeConverter = value => {
  var d = new Date(value);
  return `'${d.toISOString()}'`;
};

Value2SQLValue.set("date", DateTimeConverter)
  .set("dateTime", DateTimeConverter)

Value2SQLValue.set("number", value => value);

Value2SQLValue.set("text", value => `'${value}'`);

Value2SQLValue.set("id", value => `'${value}'`);

Value2SQLValue.set("phone", value => `'${value}'`);

Value2SQLValue.set("email", value => `'${value}'`);

Value2SQLValue.set("id", value => `'${value}'`);

Value2SQLValue.set("currency", value => `'${value}'`);

Value2SQLValue.set("boolean", value => (value ? 1 : 0));
