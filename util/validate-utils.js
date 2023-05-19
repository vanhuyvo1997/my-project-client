const emailRegex =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


export function isValidName(name){
    return name && name.trim() != "";
}

export function isValidEmail(email){
    return String(email).toLocaleLowerCase().match(emailRegex);
}

export function isValidPassword(password){
    return String(password).match(passwordRegex);
}
