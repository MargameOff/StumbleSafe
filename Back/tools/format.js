const checkIfIsValidMail = (value) => {
    let reg = /\S+@\S+\.\S+/;
    return reg.test(value);
}
export { checkIfIsValidMail }