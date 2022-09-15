export const generatePassword = () => {
    const symbols = "abcdefghijkmnopqrstuvwxyz";
    const digits = "1234567890";
    
    const lenPass = 8;

    let pass = "";

    for (let i = 0; i < 3; i++) {
        let rnd = Math.trunc(Math.random() * (symbols.length - 1));
        pass += symbols[rnd];
    }

    for (let i = 3; i < lenPass; i++) {
        let rnd = Math.trunc(Math.random() * (digits.length - 1));
        pass += digits[rnd];
    }

    return pass;
}

export const generateLightPassword = () => {
    const digits = "1234567890";
    
    const lenPass = 6;

    let pass = "";

    for (let i = 0; i < lenPass; i++) {
        let rnd = Math.trunc(Math.random() * (digits.length - 1));
        pass += digits[rnd];
    }

    return pass;
}