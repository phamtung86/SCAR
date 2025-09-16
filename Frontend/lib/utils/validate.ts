  export const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  export const validatePhoneVN = (phone: string) => {
  const regex = /^(0[3|5|7|8|9])[0-9]{8}$/;
  return regex.test(phone);
}
