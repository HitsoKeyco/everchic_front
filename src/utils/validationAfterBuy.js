
const validationAfterBuy = ( userData ) => {
    const errors = {};
    
    if (userData) {
        errors.dni = validateDNI(userData.dni);
        errors.firstName = validateFirstName(userData.firstName);
        errors.lastName = validateLastName(userData.lastName);
        errors.phone_1 = validatePhone(userData.phone_first);
        if (userData.phone_second) {
            errors.phone_2 = validatePhone2(userData.phone_second);
        }
        errors.city = validateCity(userData.city);
        errors.address = validateAddress(userData.address);        
        if (userData.email) {
            errors.email = validateEmail(userData.email);
        }
        if (userData.password) {
            errors.password = validatePassword(userData.password);
        }
    }
    
    if (userData == null){
        errors.userData = "Por favor, llene su información de usuario.";
        
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

export default validationAfterBuy;


function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'hotmail.es',
        'aol.com', 'icloud.com', 'mail.com', 'zoho.com',
        'yandex.com', 'protonmail.com', 'gmx.com',
        'ec', 'com.ec', 'net.ec', 'fin.ec', 'med.ec', 'edu.ec', 'gob.ec'
    ];

    if (!email || email.trim() === "") {
        return 'El correo electrónico es requerido.';
    }

    if (!emailRegex.test(email)) {
        return 'Tu email tiene un formato no adecuado';
    }
    const domain = email.split('@')[1];
    if(!validDomains.includes(domain)){
        return `Verifica tu correo por favor: ${email} `
    }

    return null;

}

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
        return 'La contraseña debe contener al menos un carácter especial.';
    }

    return null;
}

function validateDNI(dni) {
    // Validar que el DNI no esté vacío y contenga solo dígitos
    const dniRegex = /^\d+$/;

    if (!dni || typeof dni !== 'string' || dni.trim() === "") {
        return "Su número de cédula es requerido.";
    } else if (!dniRegex.test(dni)) {
        return "El número de cédula solo debe contener dígitos numéricos.";
    } else if (dni.length !== 10 && !(dni.length === 13 && dni.endsWith("001"))) {
        return "El número de cédula debe tener 10 dígitos o 13 dígitos 'RUC'.";
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

function validatePhone(phone) {
    const phoneRegex = /^09\d{8}$/;

    if (!phone || typeof phone !== 'string' || phone.trim() === "") {
        return "Su número de teléfono es requerido para efectuar el pedido.";
    } else if (!phoneRegex.test(phone)) {
        return "El número de teléfono debe comenzar con '09' y tener 10 dígitos.";
    }

    return null;
}

function validatePhone2(phone) {
    const phoneRegex = /^09\d{8}$/;

    if (!phone || typeof phone == 'string' || phone.trim() === "") {
        return "Su número de teléfono es requerido para efectuar el pedido.";
    } else if (!phoneRegex.test(phone)) {
        return "El número de teléfono debe comenzar con '09' y tener 10 dígitos.";
    }

    return null;
}

function validateCity(city) {
    if (!city || typeof city !== 'string' || city.trim() === "") {
        return "Su ciudad es requerida para efectuar el pedido.";
    } else if (!/^[a-zA-Z\s]+$/.test(city)) {
        return "La ciudad no debe contener caracteres especiales ni números.";
    }
    return null;
}

function validateAddress(address) {
    if (!address || typeof address !== 'string' || address.trim() === "") {
        return "Su dirección es requerida para efectuar el pedido.";
    }
    return null;
}

