//object - keeps track of the values
const Calculator = {
  //this is displays 0 on the scteen
  Display_Value: "0",
  // first operand, set up for null now
  First_Operand: null,
  //this will check if the second operand has an input
  Wait_Second_Operand: false,
  //operator, null for now
  operator: null,
};

// this modifies value each time button is clicked
function Input_Digit(digit) {
  const { Display_Value, Wait_Second_Operand } = Calculator;
  //we are checking to see if Wait_Second_operand is true and set
  //Display_Value to the key that was clicked
  if (Wait_Second_Operand === true) {
    Calculator.Display_Value = digit;
    Calculator.Wait_Second_Operand = false;
  } else {
    //this verwrites Disply_Value if the current value is 0
    //otherwise adds into it
    Calculator.Display_Value =
      Display_Value === "0" ? digit : Display_Value + digit;
  }
}

//decimal point
function Input_Decimal(dot) {
  //this ensures that accidental clicking of the decimal point
  //doesn't cause bugs in your operation
  if (Calculator.Wait_Second_Operand === true) return;
  if (!Calculator.Display_Value.includes(dot)) {
    //if the display value does't include dot, we want to add a decimal point
    Calculator.Display_Value += dot;
  }
}

//this handles operators
function Handle_Operator(Next_operator) {
  const { First_Operand, Display_Value, operator } = Calculator;
  //when an operator key is pressed, we convert the current number displayed to na number
  //and store it in the Calculator.First_Operand if it doesnt already exist
  const Value_of_Input = parseFloat(Display_Value);
  //checking if an operator alredy exist and if Wait_Second_Operand is thue
  //then updates the operator and exits the function
  if (operator && Calculator.Wait_Second_Operand) {
    Calculator.operator = Next_operator;
    return;
  }
  if (First_Operand == null) {
    Calculator.First_Operand = Value_of_Input;
  } else if (operator) {
    //checks if opeartor already exist
    const Value_Now = First_Operand || 0;
    //if operator exist, property lookup is performed for the operator
    //in the Perform_calculation oblectand the function that matches the
    //operator is executed
    let result = Perform_calculation[operator](Value_Now, Value_of_Input);
    //here we add a fixed amount of numbers after the decimal
    result = Number(result).toFixed(9);
    // this will remove any trailing 0's
    result = (result * 1).toString();
    Calculator.Display_Value = parseFloat(result);
    Calculator.First_Operand = parseFloat(result);
  }
  Calculator.Wait_Second_Operand = true;
  Calculator.operator = Next_operator;
}
const Perform_calculation = {
  "/": (First_Operand, Second_Operand) => First_Operand / Second_Operand,
  "*": (First_Operand, Second_Operand) => First_Operand * Second_Operand,
  "+": (First_Operand, Second_Operand) => First_Operand + Second_Operand,
  "-": (First_Operand, Second_Operand) => First_Operand - Second_Operand,
  "=": (First_Operand, Second_Operand) => Second_Operand,
};
function Calculator_Reset() {
  Calculator.Display_Value = "0";
  Calculator.First_Operand = null;
  Calculator.Wait_Second_Operand = false;
  Calculator.operator = null;
}
// this updates the scereen with ther content of display value
function Update_display() {
  const display = document.querySelector(".calculator-screen");
  display.value = Calculator.Display_Value;
}
Update_display();
//this section monitors button clicks
const keys = document.querySelector(".calculator-keys");
keys.addEventListener("click", (event) => {
  //the target variable is the element that was clicked
  const { target } = event;
  //if the element clicked is not the button, exit function
  if (!target.matches("button")) {
    return;
  }
  if (target.classList.contains("operator")) {
    Handle_Operator(target.value);
    Update_display();
    return;
  }
  if (target.classList.contains("decimal")) {
    Input_Decimal(target.value);
    Update_display();
    return;
  }
  //ensures that AC clears the numbers from the Calculator
  if (target.classList.contains("all-clear")) {
    Calculator_Reset();
    Update_display();
    return;
  }
  Input_Digit(target.value);
  Update_display();
});
