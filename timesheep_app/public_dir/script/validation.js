/**
 * Created with JetBrains WebStorm.
 * User: EMDnew
 * Date: 28/03/17
 * Time: 11:00
 * To change this template use File | Settings | File Templates.
 */


function validateName(name){
    var flag = true;
    if(!/^[A-Za-z ]{3,}$/g.test(name)){
        flag = false;
    }
    return flag;
}

/* Validate Value length  must be less than length */
function validateValueLength(val, len){
    var flag = true;
    if(val.length > len){
        flag = false;
    }
    return flag;
}


function validationForData(user){
    var uidErr = document.getElementById('uidErr');
    var nameErr = document.getElementById('nameErr');
    var genderErr = document.getElementById('genderErr');
    var dobErr = document.getElementById('dobErr');
    var dojErr = document.getElementById('dojErr');
    var deptErr = document.getElementById('deptErr');

    var flag = true;
    if(!/^[A-Za-z ]{3,50}$/g.test(user.name)){
        nameErr.innerHTML = '    * Name must be Letter except Space ..!';
        flag =false;
    }
    if(!/^[A-Za-z0-9_ -]{3,30}$/g.test(user.dept)){
        deptErr.innerHTML = '    * Department must be Letter, Space, underscore or dash ..!';
        flag =false;
    }
    if(!/^[A-Za-z]{4,6}$/g.test(user.gender)){
        genderErr.innerHTML = '    * Gender must be Letter ..!';
        flag =false;
    }
    if(!/^\d{4}-\d{2}-\d{2}$/g.test(user.dob)){
        dobErr.innerHTML = '    * date must be yyyy/mm/dd format ..!';
        flag =false;
    }
    if(!/^\d{4}-\d{2}-\d{2}$/g.test(user.doj)){
        dojErr.innerHTML = '    * date must be yyyy/mm/dd format ..!';
        flag =false;
    }
    return flag;
}







/* Model data  */
function Phase(id, name, description){
    this.id = id;
    this.name = name;
    this.description = description;
}