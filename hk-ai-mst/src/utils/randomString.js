export const randomString = (len = 32) => {
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const max = char.length;
  let uuid = '';
  for (let i = 0 ; i < len; i++){
    uuid += char.charAt(Math.floor( Math.random() * max ));
  }
  return uuid;
};