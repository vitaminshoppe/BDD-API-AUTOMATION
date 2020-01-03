const fs = require('fs');
const { join, basename } = require('path');
const readline = require('readline');
const Stream = require('stream');

const isDirectory = source => fs.lstatSync(source).isDirectory();
const isFile = source => fs.lstatSync(source).isFile();

var getFolderContents = function(dir){
	var contentObj= {};
	if(fs.existsSync(dir)){
		var files = fs.readdirSync(dir);
		var directoryList = files.map(name => join(dir, name)).filter(isDirectory)
		//contentObj.root = getFilesList(dir);
		for(let i=0; i< directoryList.length; i++){
			var listOfFiles = getFilesList(directoryList[i])
			if(listOfFiles.length > 0){
				contentObj[basename(directoryList[i])] = listOfFiles
			}
		}
		return contentObj;
	}else{
		throw new Error("The provided directory does not exists: ", dir);
	}
}


/**
 * [getFilesList Gets the list of existing files from the given directory]
 * @param  {String} dir [path to dir]
 * @return {Array}     [List of filenames]
 */
var getFilesList = function(dir){
	if(fs.existsSync(dir)){
		var files = fs.readdirSync(dir);
		var filesList = [];
		filesList = files.map(name => join(dir, name)).filter(isFile)
		.map(filename =>{
			return basename(filename);
		}).filter(filename =>{
			return filename.indexOf('auth.json') < 0;
		});
		console.log(filesList)
		return filesList;
	}else{
		throw Error("The provided directory does not exists: ", dir);
	}
}

exports.getLastLine = (fileName, minLength) => {
    let inStream = fs.createReadStream(fileName);
    let outStream = new Stream;
    return new Promise((resolve, reject)=> {
        let rl = readline.createInterface(inStream, outStream);

        let lastLine = '';
        rl.on('line', function (line) {
            if (line.length >= minLength) {
                lastLine = line;
            }
        });

        rl.on('error', reject)

        rl.on('close', function () {
            resolve(lastLine)
        });
    })
}

exports.getFilesList = getFilesList;
exports.getFolderContents = getFolderContents;
