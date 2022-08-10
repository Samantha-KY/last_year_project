const pool = require('../dbConfig');
const bcrypt = require('bcrypt');

const  getAllMembers = async (req, res, next) => {

    const allProducts = await pool.query("SELECT * FROM members");
res.json({status: 200,data: allProducts.rows});
// pool.end();
};

const createNewMember = async (req, res)=> {
    const{first_name, last_name, phone, family_member, age, gender, 
        marital_status, 
        children_number, 
        child_age, 
        child_names,
        email, 
        password, 
        password2} = req.body;

    // if(family_member > 0) {
        // console.log({
        //     first_name,
        //     last_name,
        //     phone,
        //     family_member,
        //     age,
        //     gender,
        //     marital_status,
        //     children_number, 
        // child_age, 
        // child_names, 
        //     email, 
        //     password, 
        //     password2
        // });

    // }else {
        console.log({
            first_name,
            last_name,
            phone,
            family_member,
            age,
            gender,
            marital_status, 
            email, 
            password, 
            password2
        });
    // }

    // let errors = [];

    // if (!email || !password || !password2 || !first_name || !last_name || !phone || !age || !gender || !marital_status || !family_member ) {
    //     errors.push({message: "please enter all fields"});
    // }
    if(password.length < 6){
        return res.json({status: 400, message: 'password should be atleast 6 characters'});

        // errors.push({message: "Password should be atleast 6 characters"});
    }

    if(password != password2){
        return res.json({status: 400, message: 'Password does not match'});

        // errors.push({message: "Password do not match"});
    }

    // if(errors.length > 0) {
    //     res.render('register', {errors});
    // } else {
    //     //validation passed

        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword,"???");

        // pool.query(
        //     `SELECT * FROM members WHERE email = $1`, [email], 
        //     (err, results)=>{
        //         if(err) {
        //             throw err;
        //         }
        //         console.log('reaching here');
        //         console.log(results.rows);
            
        //         if (results.rows.length > 0) {
        //             errors.push({message: "email already exist"});
        //             res.render("register", {errors});
        //         }else {
                    const newMember = await pool.query(
                        `INSERT INTO members (first_name, last_name, email, phone, family_member, age, gender, marital_status, children_number, child_age, child_names, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,[first_name, last_name, email, phone, family_member, age, gender, marital_status, children_number, child_age, child_names, hashedPassword],
                        // (err, results) => {
                        //     if (err){
                        //         throw err;
                        //     }
                        //     console.log(results.rows);
                        //     req.flash('success_msg', "you are now registered, please login");
                        //     res.redirect("/members/login");
                        // } 
                    )
                    if(newMember.rowCount === 0) {
                        return res.json({status: 400, message: 'bad request'});
                    }
                    return res.json({status: 200, message: 'member created', data: newMember.rows});
               
                };
            // }
        // );
    // }
// };

const findMemberById = async (req, res, next) => {
        
    const {id} = req.params;
try {
    const member = await pool.query("SELECT * FROM members WHERE member_id = $1", [id]); 
    
    if (member.rowCount === 0) {
        return res.json({status: 400, message: 'member does not exist'});
        // throw new Error (createError(404, "product not exist")); 

    } 
        // console.log(product);
    res.json({status: 200, data: member.rows[0]});



    } 
    catch (error) {
        console.error(`member does not exist: ${error}`);
    }
};

const updateMember = async (req, res, next) => {
    
    // try {
        const {id} =req.params;
        const{first_name, last_name, phone, family_member, age, gender, 
            marital_status, 
            children_number, 
            child_age, 
            child_names,
            email, 
            password, 
            password2} = req.body;
            
            if(password.length < 6){
                return res.json({status: 400, message: 'password should be atleast 6 characters'});
        
                // errors.push({message: "Password should be atleast 6 characters"});
            }
        
            if(password != password2){
                return res.json({status: 400, message: 'Password does not match'});
        
                // errors.push({message: "Password do not match"});
            }

            const hashedPassword = await bcrypt.hash(password, 10);

        const updateMember = await pool.query("UPDATE members SET first_name = $1, last_name=$2, email=$3, phone=$4, family_member=$5, age=$6, gender=$7, marital_status=$8, children_number=$9, child_age=$10, child_names=$11, password=$12 WHERE member_id = $13", [first_name, last_name, email, phone, family_member, age, gender, marital_status, children_number, child_age, child_names, hashedPassword,id]);
        
        if (updateMember.rowCount === 0) {

            return res.json({status: 400, message: 'member does not exist'});

        } 
            return res.json({status: 200, message: 'member updated'});
};

const deleteMember = async (req, res, next) => {
    try {
    const {id} = req.params;
        
            const deleteMember = await pool.query("DELETE FROM members WHERE member_id = $1", [id]);
            
            if (deleteMember.rowCount === 0) {
                return res.json({status: 400, message: 'member does not exist'});
            }  
                return res.json({status: 200, message: 'member deleted', res: deleteMember});
            
            
    } catch (error) {
        console.log(`member does not exist: ${error}`)
        return res.json({status: error.statusCode, message: error.message});
    }
};

module.exports = {
    getAllMembers,
    createNewMember,
    updateMember,
    deleteMember,
    findMemberById
}