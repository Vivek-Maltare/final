const {addBook,selectbook,displaybooksbytime,updateBook,selectbookicon,selectbookfile,uploadbookFile,uploadbookicon,selectBookByCategory}=require('../../api/users/users.service');
module.exports={
    addBooks:(req,res)=>{
        const body=req.body;
        addBook(body,(err,results)=>{
            if(err)
            {
                console.log(err);
                return res.status(400).json({
                    success:0,
                    messege:"database connection error"
                });
            }
            else{
                return res.status(200).json({
                    success:1,
                    data:results
                });
            };
        })
    },
    selectbooks:(req,res)=>{
       selectbook((err,results)=>{
           if(err)
           {
               console.log(err);
               return;
           }
           else{
               return res.json({
                   success:1,
                   data:results
               })
           }
       })
    },
    displaybooksbytimes:(req,res)=>{
        
        displaybooksbytime((err,results)=>{
            
            if(err)
            {
                console.log(err);
            }
            else{
                return res.json({
                    success:1,
                    data:results
                })
            }
        })
    },

    uploadbookicon:(req,res)=>{
        const body=req.file;
        const name = req.params.name;
       
        uploadbookicon(body,name,(err,results)=>{
            if(err)
            {
                console.log(err);
                return res.status(400).json({
                    success:1,
                    messege:"database connection error"
                });
            }
            else{
                //return res.send(`File has been uploaded.`);
          
               return res.status(200).json({
                    success:1,
                    data:results
                });
            };
        })
    },

    updatebooks:(req,res)=>{
        const body=req.body;
        //const name = req.params.name;
        updateBook(body,(err,results)=>{
            if(err)
            {
                console.log(err);
                return;
            }
            if(!results)
            {
                res.json({
                    success:0,
                    messege:"books not updated successfully"
                });     
            }
            res.json({
                success:1,
                messege:"books updated successfully"
            });
        })
    },

    getbookicon:(req,res)=>{
        selectbookicon((err,results)=>{
            if(err)
            {
                console.log(err);
                return;
            }
            else{
                var name= results[0].name;
               const data= results[0].data;
               console.log(`data is ${name}`);
               // res.render("book_icon", { data: results[0].data.toString('base64'), name: results[0].name});
               // res.render("book_res", { data: results[0].data, name: results[0].name});
        
                return res.json({
                    success:1,
                    data:results
                })
            }
        })
     },
     
     uploadbookFile:(req,res)=>{
        const body=req.file;
        const name = req.params.name
        uploadbookFile(body,name,(err,results)=>{
            if(err)
            {
                console.log(err);
                return res.status(400).json({
                    success:0,
                    messege:"database connection error"
                });
            }
            else{
                //return res.send(`File has been uploaded.`);
          
               return res.status(200).json({
                    success:1,
                    data:results
                });
            };
        })
    },

    getbookfile:(req,res)=>{
        //const body= req.params.name;
        selectbookfile((err,results)=>{
            if(err)
            {
                console.log(err);
                return;
            }
            else{
                var name= results[0].name;
               const data= results[0].data;
               console.log(`data is ${data}`);
                //res.render("book_res", { data: results[0].data, name: results[0].name});
        
                return res.json({
                    success:1,
                    data:results
                })
            }
        })
     },
     selectbooksbycategory:(req,res)=>{
         const body=req.params.cat;
        selectBookByCategory(body,(err,results)=>{
            if(err)
            {
                console.log(err);
                return;body
            }
            else{
                return res.json({
                    success:1,
                    data:results
                })
            }
        })
     },

}