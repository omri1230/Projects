////////////////BUDGET CONTROLLER////////////////
var budgetController = (function() {
    //private method of budgetController for Expense and Income
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
                    this.percentage = Math.round((this.value / totalIncome) * 100);
            } else {
                this.percentage = -1;
                   } 
        
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;  
    };
     var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    //struture to store the data 
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
   return {
       addItem: function(type, des, val) {
           
           var newItem, ID;
           //Create new ID
           if (data.allItems[type].length > 0) {
               ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
           } else {
               ID = 0;
           }
           //Create new item based on 'inc' or 'exp' type
           if (type === 'exp') {
               newItem = new Expense(ID, des, val);
           } else if (type === 'inc') {
               newItem = new Income(ID, des, val);
           }
           //push it into our data structrue 
           data.allItems[type].push(newItem);
           //Return the new element 
           return newItem;
       }, 
       
       deleteItem: function(type, id) {
           var ids, index;
           //We use in the map function for return a new mapping array
           //ids is the array
           //index is the location we want to remove
            ids = data.allItems[type].map(function(currnet) {
               return currnet.id;
           });
           //indexOf return the the position of the first occurrence of specified value
           index = ids.indexOf(id);
           if( index !== -1) {
               //splice- remove elments(what to remove , how much to the)delete 
               data.allItems[type].splice(index, 1);
           }
       },
       calculateBudget: function() {
           //calculate total income and expenses 
           calculateTotal('exp');
           calculateTotal('inc');
           //calcute the budget: income - expenses
           data.budget = data.totals.inc - data.totals.exp;
           //calcute the percentage of income  that we spent 
           if (data.totals.inc > 0) {
               data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
           } else {
               data.percentage = -1;
           }
           
       },
       calculatePercentages: function() {
           data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.totals.inc);
           });   
       },
       getPercentages: function() {
         var allPerc = data.allItems.exp.map(function(cur) {
            return cur.getPercentage();
         });
           return allPerc;
       },
       getBudget: function() {
           return {
               budget: data.budget,
               totalInc: data.totals.inc,
               totalExp: data.totals.exp,
               percentage: data.percentage
           };
       },
       testing: function() {
           console.log(data);
       }
   }
       
})();



////////////////UI CONTROLLER////////////////
var UIController = (function() {
    //DOMstrings for make our life esaier if we need to change 
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContianer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
        
    };
    var formatNumber = function(num, type) {
            var numSplit, int, dec;
            //Turn the number to positive 
            num = Math.abs(num);
            //return a string with 2 digits or char after the point 
            num = num.toFixed(2);
            //spilt the intger part and decimal 
            numSplit = num.split('.');
            int = numSplit[0];
             if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
            }
            dec = numSplit[1];
             //return + if exp or - if inc 
            return (type === 'exp' ? '-': '+') + int + '.' + dec;
    };
    var nodeListForEach = function(list, callback) {
              for (var i = 0; i < list.length; i++) {
                  callback(list[i], i);
              }
    };
    return {
      getInput: function() {
          return {
               type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
               description: document.querySelector(DOMstrings.inputDescription).value, 
               value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
          };   
      },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //Create a html string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContianer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
            }
            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //Insert the html into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
            
        },
        deleteListItem: function(selectorID) {
            //we choose from the document th id with the help of getElementId
            //and because we can only remove a child we need to know who is the the father 
           var el = document.getElementById(selectorID); 
           el.parentNode.removeChild(el);
        },
        clearFields: function() {
            var fileds, fieldsArr;
            fileds = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            //because the function querySelectorAll returns someting ugly, we use in array with prototype and slice with call .

            fieldsArr = Array.prototype.slice.call(fileds);
            fieldsArr.forEach(function(currnet, index, array) {
                currnet.value = "";
                
            });
            
            fieldsArr[0].focus()
        },
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if( obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent =  '---'
            }
            
        },
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
        
             nodeListForEach(fields, function(currnet, index) {
                if(percentages[index] > 0) {
                     currnet.textContent =  percentages[index] + '%';
                } else {
                     currnet.textContent =  '---';
                }
            });
            
        },
        displayMonth: function() {
            var now, month, year;
             now = new Date();
            months = ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent =  months[month] + ' ' +year;
        },
        changeType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType, + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue)
            nodeListForEach(fields, function(cur){
                //toggle add red-focus class when its not there 
                //and when its there on some element then it removes it 
                cur.classList.toggle('red-focus');
            });
           //classList- return the class name of an element, as DOMTokenLIst , its a convenient alternative to accessing an element's list of classes 
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();


////////////////GLOBAL APP CONTROLLER////////////////
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
         var DOM = UICtrl.getDOMstrings();
        //we have a point becuase that a class selctor
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrAddItem);
    
        document.addEventListener('keypress', function(event) {
        //keycode is propty in the object which for browsers without keycode, 13 is for enter
            if (event.keyCode === 13 || event.which === 13) {
                ctrAddItem();
            }
        
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    
    };
    
    var updatePercentages = function() {
        //1. calcuate percentages
        budgetCtrl.calculatePercentages();
        //2. read percentages from the budget controller 
        var percentages = budgetCtrl.getPercentages();
        //3. update the UI with the new percentages 
        UICtrl.displayPercentages(percentages);

    };
    
    var updateBudget = function() {
        //1.Calcute the budget 
        budgetCtrl.calculateBudget();
       //Return the budget
        var budget = budgetCtrl.getBudget();
       //3.Display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    
    var ctrAddItem = function() {
        var input, newItem;
        //1.Get the field input data 
        input = UICtrl.getInput();//a public method that we can a accses
        // if the description is not empty and the value is a number and value bigger than 0 
        if (input.description !== "" && input.value > 0) {
            // 2.Add the item to the budget controller 
            newItem = budgetController.addItem(input.type, input.description, input.value);
            //3.Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            //4.Clear the field 
            UICtrl.clearFields();
            //Calculate and update budget
            updateBudget(); 
            //Calculate and update Percentages
            updatePercentages();

        }
       
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        //event.target- is the element where the event was fired, in the html file 
        //DOM traversing- go up in the html file to the parent that we need 
        //in our case the element is the income 
        //itemID- is a id number that we click on the remove icon 
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //if itemID exists is true if not its false 
        if(itemID) {
            //inc -1, return a split strings 
            splitID = itemID.split('-');
            type = splitID[0];
            //We use in parseINt because now the id is a string and in deleteItem we compare string with number 
            ID = parseInt(splitID[1]);
            //1.Delete the item from data strutrue 
            budgetCtrl.deleteItem(type, ID);
            //2.Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            //Update and show the new budget
             updateBudget(); 
            //Calculate and update Percentages
            updatePercentages();
        }
    };   
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
               budget: 0,
               totalInc: 0,
               totalExp: 0,
               percentage: -1  
           });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);



controller.init();

