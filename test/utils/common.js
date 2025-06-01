//Devuelve un string con la fecha y hora actual en formato [YYYY-MM-DD hh:mm:ss]
function getTimestamp() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];
  return `[${date} ${time}]`;
}

module.exports = {
  getTimestamp,
};
