module.exports = function dateToMysql(date = null)
{
    return (date == null ? new Date() : date).toISOString().slice(0, 19).replace('T', ' ');
}