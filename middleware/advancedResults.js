const advancedResults = (model,populate) =>async(req,res,next)=>{
    let query;

    //copy request query
    const reqQuery= { ...req.query};

    //Field to exclude 

    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])
    //create qeury string
    let queryString= JSON.stringify(reqQuery);
    //add dollar symbol to gt , lt etc
    queryString= queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
   
query = model.find(JSON.parse(queryString));

//select fields
if(req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query= query.select(fields)
}

//sort
if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query= query.sort(sortBy);
}
//default sort
else{
query=query.sort('createdAt');
}

//pagination
const page = parseInt(req.query.page,10) || 1;
const limit = parseInt(req.query.limit,10) || 5;
const startIndex = (page-1)*limit
const endIndex = page*limit;
const total= await model.countDocuments();
//when we reach the 2nd page , documents in first has to b skipped
query=query.skip(startIndex).limit(limit)
if(populate){
    query.populate(populate);
}
   //finding resource
    query
   .then((resp) =>{
       //pagination result
       const pagination ={}
       //not last page
       if(endIndex<total){
           pagination.next={
               page: page+1,
               limit: limit
           }
       }
       //not first page
       if(startIndex>0 && startIndex<total){
        pagination.prev={
            page: page-1,
            limit: limit
        }
       
} 
res.advancedResults ={
    success: true,
    count: resp.length,
    pagination,
    data: resp
}
next();
})
   
}
module.exports= advancedResults;