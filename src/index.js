import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ConditionLine from "./ConditionLine";
import { operandTypes, operatorTypes } from "./Settings";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column"
  },
  conditionSection: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    //margin: theme.spacing.unit / 2
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  }
});

class LogiFilterBuilder extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    if (props.preLoadConditions) {
      this.state = {
        Error: false,
        conditions: props.preLoadConditions
      };
    } else {
      this.state = {
        conditions: [
          {
            Error: false,
            type: "Simple",
            column: undefined,
            operator: undefined,
            value: undefined,
            operand: operandTypes.get("AND")
          }
        ]
      };
    }
  }

  addNewCondition() {
    let conditions = [...this.state.conditions];
    conditions.push({
      type: "Simple",
      column: undefined,
      operator: undefined,
      value: undefined,
      operand: operandTypes.get("AND")
    });
    console.log("Conditions: ", conditions);
    this.validateAndCreate(conditions);
  }

  addNewNestedCondition() {
    let conditions = [...this.state.conditions];
    // @ts-ignore
    conditions.push({
      type: "Nested",
      conditions: [
        {
          type: "Simple",
          column: undefined,
          operator: undefined,
          value: undefined,
          operand: operandTypes.get("AND")
        }
      ],
      operand: operandTypes.get("AND")
    });
    this.validateAndCreate(conditions);
  }

  removeCondition(conditionIndex) {
    let conditions = [...this.state.conditions];
    conditions.splice(conditionIndex, 1);
    if (conditions.length > 0) {
      this.validateAndCreate(conditions);
    } //case user remove the last condition => we'll add one empty condition
    else {
      this.validateAndCreate([
        {
          type: "Simple",
          column: undefined,
          operator: undefined,
          value: undefined,
          operand: operandTypes.get("AND")
        }
      ]);
    }
  }

  handleChange(
    selectedColumn,
    index,
    value,
    changeType,
    translateValue = null
  ) {
    let conditions = [...this.state.conditions];
    let condition;
    if (changeType === "column")
      condition = {
        ...selectedColumn,
        column: this.props.columns.filter(c => c.header === value)[0]
      };
    else if (changeType === "operator")
      condition = {
        ...selectedColumn,
        operator: operatorTypes
          .get(selectedColumn.column.dataType)
          .filter(opt => opt.Label === value)[0]
      };
    else if (changeType === "value")
      condition = {
        ...selectedColumn,
        value: { value: value, translateValue: translateValue }
      };
    else if (changeType === "operand")
      condition = {
        ...selectedColumn,
        operand: operandTypes.get(value)
      };
    conditions[index] = condition;
    this.validateAndCreate(conditions);
  }

  validate(conditions) {
    var isValid = true;
    var filter = "";
    var index = 0;
    conditions.forEach(c => {
      if (c.type === "Simple") {
        isValid =
          isValid &&
          (c.column &&
            c.column.accessor &&
            c.operator &&
            c.operator.TranslateTo &&
            c.value &&
            c.value.translateValue !== undefined &&
            c.value.value !== undefined &&
            c.value.value !== "");

        if (isValid) {
          filter =
            filter +
            `${c.column.accessor} ${c.operator.TranslateTo} ${
              c.value.translateValue
            } ${index + 1 < conditions.length ? c.operand.TranslateTo : ""}`;
        }
      } else {
        var returnedObj = this.validate(c.conditions);
        isValid = isValid && returnedObj.isValid;
        filter =
          filter +
          ` (  ${returnedObj.filter} )  ${
            index + 1 < conditions.length ? c.operand.TranslateTo : ""
          }`;
      }
      index++;
    });
    return { isValid, filter };
  }

  validateAndCreate(conditions) {
    //validate
    var { isValid, filter } = this.validate(conditions);
    //console.log(isValid);

    this.setState({
      Error: !isValid, //"Please fix errors highlighted red and try again",
      conditions,
      filterStatement: filter
    });

    //in case of nested changes this will update the parent conditions
    if (this.props.onChange) {
      this.props.onChange(conditions);
    }
  }

  render() {
    var { classes, columns } = this.props;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ExpansionPanel defaultExpanded={this.props.startExpanded}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              {this.state.Error
                ? "Please fix errors"
                : this.state.filterStatement
                ? this.state.filterStatement
                : this.props.header
                ? this.props.header
                : "Create Filter"}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.root}>
              {this.state.conditions.map((condition, index) => {
                return (
                  <section key={index} className={classes.conditionSection}>
                    {condition.type === "Simple" ? (
                      <React.Fragment>
                        <ConditionLine
                          key={index}
                          classes={classes}
                          condition={condition}
                          index={index}
                          handleChange={this.handleChange}
                          columns={columns}
                        />
                        {condition.operator &&
                        index + 1 < this.state.conditions.length ? (
                          <FormControl className={classes.formControl}>
                            <Select
                              value={
                                condition.operand.Label //default must be AND
                              }
                              onChange={e =>
                                this.handleChange(
                                  condition,
                                  index,
                                  e.target.value,
                                  "operand"
                                )
                              }
                              inputProps={{
                                name: "operand",
                                id: "operand-select"
                              }}
                              native
                            >
                              {Array.from(operandTypes.values()).map(
                                operand => {
                                  return (
                                    <option
                                      value={operand.Label}
                                      key={operand.Label}
                                    >
                                      {operand.Label}
                                    </option>
                                  );
                                }
                              )}
                            </Select>
                          </FormControl>
                        ) : null}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <LogiFilterBuilder
                          columns={columns}
                          classes={classes}
                          preLoadConditions={condition.conditions}
                          onChange={newInnerConditions => {
                            //on purpose doing it like this to avoid re render (?!)
                            this.state.conditions[
                              index
                            ].conditions = newInnerConditions;
                            this.validateAndCreate(this.state.conditions);
                          }}
                          isNested={true}
                          header={"Nested Condition"}
                        />
                        {index + 1 < this.state.conditions.length ? (
                          <FormControl className={classes.formControl}>
                            <Select
                              value={
                                condition.operand.Label //default must be AND
                              }
                              onChange={e =>
                                this.handleChange(
                                  condition,
                                  index,
                                  e.target.value,
                                  "operand"
                                )
                              }
                              inputProps={{
                                name: "operand",
                                id: "operand-select"
                              }}
                              native
                            >
                              {Array.from(operandTypes.values()).map(
                                operand => {
                                  return (
                                    <option
                                      value={operand.Label}
                                      key={operand.Label}
                                    >
                                      {operand.Label}
                                    </option>
                                  );
                                }
                              )}
                            </Select>
                          </FormControl>
                        ) : null}
                      </React.Fragment>
                    )}

                    <Button
                      variant={"outlined"}
                      aria-label="Remove"
                      className={classes.button}
                      onClick={() => {
                        this.removeCondition(index);
                      }}
                    >
                      {"-"}
                    </Button>
                  </section>
                );
              })}
            </div>
          </ExpansionPanelDetails>
          <Divider />
          <ExpansionPanelActions>
            <Button
              variant={"outlined"}
              aria-label="AddNested"
              className={classes.button}
              onClick={() => {
                this.addNewNestedCondition();
              }}
            >
              {"Add Nested"}
            </Button>
            <Button
              variant={"outlined"}
              aria-label="Add"
              className={classes.button}
              onClick={() => {
                this.addNewCondition();
              }}
            >
              {"Add"}
            </Button>
            {!this.props.isNested && (
              <Button
                disabled={this.state.Error}
                variant={"outlined"}
                onClick={() =>
                  this.props.getFilterStatement(this.state.filterStatement)
                }
                size="small"
                color="primary"
              >
                Apply
              </Button>
            )}
          </ExpansionPanelActions>
        </ExpansionPanel>
      </MuiPickersUtilsProvider>
    );
  }
}

LogiFilterBuilder.propTypes = {
  /** Array of Objects defining columns
   * {header, accessor, dataType, isReadOnly, isHidden}*/
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      dataType: PropTypes.oneOf([
        "id",
        "text",
        "number",
        "date",
        "dateTime",
        "phone",
        "boolean",
        "email",
      ]),
      isHidden: PropTypes.bool //if not available will be shown
    })
  ).isRequired,
  /** Text instead of "Create Filter" being used for nested filters internally */
  header: PropTypes.string,
  /** Clicking on Apply will call this function and return the created filter (Where clause) */
  getFilterStatement: PropTypes.func,
  /** Send true if you want the expansion panel to be open */
  startExpanded: PropTypes.bool
};

LogiFilterBuilder.defaultProps = {
  startExpanded: false
};

//exporting like this so Docz will pick the props!
export default (LogiFilterBuilder = withStyles(styles, { withTheme: true })(
  LogiFilterBuilder
));
