function getNested (theObject, path, separator) {
    try {
        separator = separator || '.';
    
        return path.
                replace('[', separator).replace(']','').
                split(separator).
                reduce(
                    function (obj, property) {
                        return obj[property];
                    }, theObject
                );
                    
    } catch (err) {
        return undefined;
    }   
}

function setNested (theObject, path, separator, value) {
    try {
        separator = separator || '.';
    	let arr = path.
			replace('[', separator).replace(']','').
            split(separator);
        let len = arr.length;
        arr.reduce(function (obj, property, currentIndex) {
        	if(currentIndex+1 === len){
        		//console.log(currentIndex, len, obj, property)
        		return obj[property] = value
        	}
            if(!obj[property] && currentIndex+1 < len){
                obj[property] = {};
            }
        	return obj[property];
        }, theObject)
        return theObject;
                    
    } catch (err) {
        console.log(err)
        return undefined;
    }   
}

exports.getNested = getNested;
exports.setNested = setNested;
