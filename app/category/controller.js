module.exports={
    index: async(req,res)=>{
        try {
            res.render('index',{title: 'barbar'});
        } catch (error) {
            console.log(error);
        }
    }
}