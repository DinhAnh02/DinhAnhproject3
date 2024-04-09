
function Validator (opitions){
    function getParent (element, selector) {
        while (element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
   var selectorRules = {};

   function validate (inputElement, rule) {
    var erorrsElenment = getParent(inputElement, opitions.formGroupSelector).querySelector(opitions.errorSelector)
    var erorrMessege ;
// lap qu tung rule va kiem tra
// neu co loi dung viec kiem tra
    var rules = selectorRules[rule.selector]
    for (var i = 0; i < rules.length; i++) {
        switch (inputElement.type) {
            case 'radio':
            case 'checkbox':
                erorrMessege  =  rules[i](
                    formElement.querySelector(rule.selector+ ':checked')
                )
            break;
            default: 

            erorrMessege  =  rules[i](inputElement.value);
        }

        if (erorrMessege) break;
    }
    if(erorrMessege) {
     erorrsElenment.innerText = erorrMessege
      getParent(inputElement, opitions.formGroupSelector).classList.add('invalid')
    }else{
     erorrsElenment.innerText = '';
      getParent(inputElement, opitions.formGroupSelector).classList.remove('invalid')
    }

    return !erorrMessege;
   }


   var formElement = document.querySelector(opitions.form);
   if( formElement ) {
    // khi submit form
      formElement.onsubmit = function (e) {
       e.preventDefault();
       var isFormValid = true;

       opitions.rules.forEach(function(rule){
        var inputElement = formElement.querySelector(rule.selector)
        var isValid = validate(inputElement,rule)
        if (!isValid) {
            isFormValid = false;
        }
       })
        if(isFormValid) {
            if(typeof opitions.onsubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]');
                var formValues = Array.from(enableInputs).reduce(function (values, input){
                   switch(input.type) {
                       case 'radio':
                        values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                        break;
                    case 'checkBox':
                        if(!input.matches(':checked')) {
                            values[input.name] = "";
                            return values;
                        }
                        if(!Array.isArray(values[input.name])) {
                            values[input.name] = [];
                        }
                        values[input.name].push(input.value); 
                        break;
                    case 'file':
                        values[input.name] = input.files;
                        break;
                    default:
                        values[input.name] = input.value;
                   }

                  return  values;
                },{})
                opitions.onsubmit(formValues);
            }else {
                formElement.submit();
            }
        }

      }

    //    lap qua moi rule va xu ly (lamg nghe su lien blur , input)
       opitions.rules.forEach(function(rule){
        // luu rule
        if(Array.isArray(selectorRules[rule.selector])) {
            selectorRules[rule.selector].push(rule.test)
        }else{
            selectorRules[rule.selector] = [rule.test]
        }

        var inputElements = formElement.querySelectorAll(rule.selector)
        Array.from(inputElements).forEach(function(inputElement){

            inputElement.onblur = function(){
              validate(inputElement,rule)
            }
   
           //  xu ly khi bam vao input
           inputElement.oninput = function() {
               var erorrsElenment =  getParent(inputElement, opitions.formGroupSelector).querySelector(opitions.errorSelector)
               erorrsElenment.innerText = '';
                getParent(inputElement, opitions.formGroupSelector).classList.remove('invalid')
           }

        })
       });

   }
   
}

// //  dinh nghia cac rules
Validator.isRequired = function (selector,messege){
    return {
     selector: selector,
     test: function (value){
          return value ? undefined :  messege || 'vui long nhap truong nay'
     }

    };
}
Validator.isEmail = function (selector,messege){
  return {
     selector: selector,
     test: function (value){
        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(value) ? undefined :  messege || 'Vui long nhap email'
      
     }

    };
}
Validator.minLength = function (selector,min,messege){
    return {
       selector: selector,
       test: function (value){
          return value.length >= min ? undefined :  messege || `Vui long nhap toi thieu ${min} ky tu`
        
       }
  
      };
  }

  Validator.isconfirmed = function (selector,getValueConfirm,messege){
    return {
        selector: selector,
        test: function(value) {
            return value === getValueConfirm() ? undefined : messege || 'gia tri vua nhap khong chinh xac'
        }
    }

  }