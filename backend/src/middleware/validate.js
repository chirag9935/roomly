// Generic body-validation middleware. Pass a zod schema; on success req.body is
// replaced with the parsed/typed result (so e.g. rent becomes a real Number).
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const err = new Error(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
      err.statusCode = 400;
      return next(err);
    }
    req.body = result.data;
    next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const err = new Error(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
      err.statusCode = 400;
      return next(err);
    }
    req.query = result.data;
    next();
  };
}

module.exports = { validate, validateQuery };