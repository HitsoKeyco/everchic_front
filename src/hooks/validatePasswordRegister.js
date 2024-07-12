
const validatePasswordRegister = ( data ) => {
    const errors = {}
    if (data) {
        errors.email = validateEmail(data.email);
        errors.password = validatePassword(data.password)
        errors.firstName = validateFirstName(data.firstName);
        errors.lastName = validateLastName(data.lastName);
    }

    // Filtrar errores no nulos
    const errorsFiltered = Object.keys(errors).reduce((acc, key) => {
        if (errors[key] !== null && errors[key] !== undefined && errors[key] !== "") {
            acc[key] = errors[key];
        }
        return acc;
    }, {});

    return errorsFiltered;
}
export default validatePasswordRegister


function validatePassword(password) {
    const minLength = 6;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (typeof password !== 'string' || password.trim() === "") {
        return 'La contraseña es requerida.';
    }
    if (password.length < minLength) {
        return `La contraseña debe tener al menos ${minLength} caracteres.`;
    }
    if (!specialCharRegex.test(password)) {
        return 'La contraseña debe contener al menos un carácter especial como: ! % & @ *';
    }

    return null;
}


function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
        'aol.com', 'icloud.com', 'mail.com', 'zoho.com',
        'yandex.com', 'protonmail.com', 'gmx.com'
    ];

    if (!emailRegex.test(email)) {
        return 'Tu email tiene un formato no adecuado';
    }
    const domain = email.split('@')[1];
    if (!validDomains.includes(domain)) {
        return `Este tipo de dominio ${domain}, no es valido, sorry. Puedes usar: gmail, yahoo, hotmail, outlook, aol, icloud, mail, zoho, yandex, protonmail, gmx`
    }

    return null;

}

function validateFirstName(firstName) {
    if (!firstName || typeof firstName !== 'string' || firstName.trim() === "") {
        return "Su nombre es requerido para efectuar el pedido.";
    } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
        return "El nombre no debe contener caracteres especiales ni números.";
    }
    return null;
}


function validateLastName(lastName) {
    if (!lastName || typeof lastName !== 'string' || lastName.trim() === "") {
        return "Sus apellidos son requerido para efectuar el pedido.";
    } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
        return "El nombre no debe contener caracteres especiales ni números.";
    }
    return null;
}