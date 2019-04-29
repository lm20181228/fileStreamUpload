/*
 *status
 * 1,返回切割的文件数据，用于页面显示
 * 2，这一批文件上传完毕，切换下一批
 * 3，传递文件名*/
onmessage=function(even){
	var getData=even.data;
	var sliceUpFile=0,newBlob="";
	var _fileIndex=0,needuploadsNum="",fileFlaw="",fileName="";
	if(getData.status==1){
		while(_fileIndex<getData.fileList[getData.fileIndex].data.length){
			fileName=getData.fileList[getData.fileIndex].data[_fileIndex].name;
			postMessage({"fileName":fileName,"fileSize":getData.fileList[getData.fileIndex].data[_fileIndex].size,"status":3});//传递文件基本信息
			needuploadsNum=Math.ceil(getData.fileList[getData.fileIndex].data[_fileIndex].size/getData.fileSize);//计算应该切片数
			fileFlaw=new Blob([getData.fileList[getData.fileIndex].data[_fileIndex]]);//创建一个二进制文件流
			
			while(sliceUpFile<needuploadsNum){
				/*计算传递的文件流*/
				if(sliceUpFile+1==needuploadsNum){
					newBlob=fileFlaw.slice(sliceUpFile*getData.fileSize);
				}else{
					newBlob=fileFlaw.slice(sliceUpFile*getData.fileSize,(sliceUpFile+1)*getData.fileSize);
				}
				sliceUpFile++;
				postMessage({"fileBlob":newBlob,"fileName":fileName,"status":1});//状态为1时表示可继续上传，对文件流做处理
			}
			_fileIndex++;
			sliceUpFile=0;
		}
		postMessage({"status":2});
	}
}

