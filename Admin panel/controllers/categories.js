const express = require('express');
const model = require('../models/catModel');

const app = express();
app.use(express.json());
 
const getcategorydata = async (req,res)=>{
    const getAllCat = await model.find();
    console.log(getAllCat);
    
    res.render('categories',{
                    username:req.cookies.UserName,
                    getAllCat: getAllCat,
                    message: '',
                    editcate: ''
                    });
    }

const savecat = async (req,res)=>{
    const getAllCat = await model.find();
    console.log(getAllCat)  
    const len = getAllCat.length+1;
    const catname = req.body.catname;
    const cName = await model.findOne({catname:catname})
    if(cName){
        req.flash('success', 'Category already exists');
        res.render('categories',{
            username: req.cookies.UserName,
            getAllCat: getAllCat,
            message : req.flash('success'),
            editcate: ''                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
        });
    }else{
        const result = {
            id: len,
            catname: catname
        }
        const savedata = new model(result);
        await savedata.save();
        // getAllCat = await model.find();
        req.flash('success',   'Category Saved');
        res.render('categories',{
            username: req.cookies.UserName,
            getAllCat: getAllCat,
            message : req.flash('success'),
            editcate: ''
        });
    }
}


const editCategory = async (req,res)=>{
    const id = req.params.id;
    getAllCat = await model.find();
    editcate = await model.findOne({_id: id});
    if(editcate){
        res.render('categories',{
            username: req.cookies.UserName,
            editcate:editcate,
            getAllCat: getAllCat,
            message: '',
        }); 
    }else{
        res.status(404).send("Category not found");
    }

}
const updateCate = async (req,res)=>{
    const id = req.params.id
    const catname = req.body.catname;
    const result = await model.findByIdAndUpdate(
            {_id:id},
            {$set:{catname:catname}
        }
    )
    getAllCat = await model.find();
    req.flash('success', 'Category updated successfully');
    if(result){
        res.render('categories',{
            username: req.cookies.UserName,
            getAllCat: getAllCat,
            message2: req.flash('success'),
            editcate:''
        }); 
    }

}

const deleteCategory = async (req,res)=>{
    try{    const id = req.params.id;
    console.log("ID to delete:", id);
    const d = await model.findByIdAndRemove({_id: id});
    console.log("Deleted category:", d);
    if(d){
        res.redirect('/admin/category')
    } else {
        res.status(404).send("Category not found");
    }
}catch(error){
    console.error("Error deleting category:", error);
        res.status(500).send("Internal Server Error");
}


}
module.exports = {  
                    getcategorydata, 
                    savecat, 
                    editCategory, 
                    deleteCategory,
                    updateCate
                };




