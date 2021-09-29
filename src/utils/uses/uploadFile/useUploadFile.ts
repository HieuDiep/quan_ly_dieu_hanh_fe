const readFileAsDataURL = (file:any) => {
   return new Promise((resolve) => {
       if (file.type.includes('image')){
           const fileReader = new FileReader();
           fileReader.onload = (e) => {
               resolve(
                   {
                       _id: `${new Date().getTime()}_${Math.random()}`,
                       name: file.name,
                       src: fileReader.result,
                       type: 'image',
                       blob: file,
                       sizes: file.size
                   }
               );
           }
           fileReader.readAsDataURL(file);
       }else{
           resolve(
               {
                   _id: `${new Date().getTime()}_${Math.random()}`,
                   name: file.name,
                   type: 'file',
                   blob: file,
                   sizes: file.size
               }
           );
       }
       
   });
}
const useUploadFile = (files:any)=>{
   const _promise = []
   for (const file of files) {
       _promise.push(readFileAsDataURL(file)) 
   }
   Promise.all(_promise)
   return Promise.all(_promise);

}
export default useUploadFile;