export const operatorTypes = new Map();
operatorTypes
  .set("number", [
    { Label: "<", TranslateTo: " < " },
    { Label: "<=", TranslateTo: " <= " },
    { Label: "=", TranslateTo: " = " },
    { Label: ">", TranslateTo: " > " },
    { Label: ">=", TranslateTo: " >= " }
  ])
  .set("dateTime", [
    { Label: "<", TranslateTo: " < " },
    { Label: "<=", TranslateTo: " <= " },
    { Label: "=", TranslateTo: " = " },
    { Label: ">", TranslateTo: " > " },
    { Label: ">=", TranslateTo: " >= " }
  ])
  .set("date", [
    { Label: "<", TranslateTo: " < " },
    { Label: "<=", TranslateTo: " <= " },
    { Label: "=", TranslateTo: " = " },
    { Label: ">", TranslateTo: " > " },
    { Label: ">=", TranslateTo: " >= " }
  ])
  .set("text", [
    { Label: "Like", TranslateTo: " Like " },
    { Label: "Not Like", TranslateTo: " Not Like " },
    { Label: "=", TranslateTo: " = " },
    { Label: "!=", TranslateTo: " != " }
  ])
  .set("id", [
    { Label: "Like", TranslateTo: " Like " },
    { Label: "Not Like", TranslateTo: " Not Like " },
    { Label: "=", TranslateTo: " = " },
    { Label: "!=", TranslateTo: " != " }
  ])
  .set("phone", [
    { Label: "Like", TranslateTo: " Like " },
    { Label: "Not Like", TranslateTo: " Not Like " },
    { Label: "=", TranslateTo: " = " },
    { Label: "!=", TranslateTo: " != " }
  ])
  .set("email", [
    { Label: "Like", TranslateTo: " Like " },
    { Label: "Not Like", TranslateTo: " Not Like " },
    { Label: "=", TranslateTo: " = " },
    { Label: "!=", TranslateTo: " != " }
  ])
  .set("boolean", [
    { Label: "=", TranslateTo: " = " },
    { Label: "!=", TranslateTo: " != " }
  ]);

export const operandTypes = new Map();
operandTypes
  .set("AND", { Label: "AND", TranslateTo: " AND " })
  .set("OR", { Label: "OR", TranslateTo: " OR " });
