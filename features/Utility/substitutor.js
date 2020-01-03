//https://github.com/tarangkhandelwal/substitutor.js
module.exports = (function(){

    var regEx=/{([^{]*?)}/g;

    var checkForSubstitutors=function(str){
        return regEx.test(str);
    }

    var getSubstitueValue = function(context)
    {
        return function(regexMatch, placeholder)
        {
            var splitArray=placeholder.split(".")
            var currentContext=context;
            while(splitArray.length){
                    var item=splitArray.shift();
                    if(typeof(currentContext)==="object" && item in currentContext)
                        currentContext=currentContext[item];
                    else
                        return;
            }
            return currentContext;
        };
    };

    return function(input, context)
    {
            while(checkForSubstitutors(input)){
               input=input.replace(regEx, getSubstitueValue(context));
            }
        return input
    };
})();
